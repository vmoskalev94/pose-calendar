package com.posecalendar.storage;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.UUID;

/**
 * Локальная реализация файлового хранилища.
 * <p>
 * Хранит файлы в файловой системе в директории,
 * заданной в StorageProperties.basePath.
 * <p>
 * Позже можно будет добавить альтернативные реализации
 * (S3 / Postgres BLOBs) и подменять их через Spring-configuration.
 */
@Service
@Slf4j
public class LocalFileStorageService implements FileStorageService {

    private final StorageProperties properties;

    /**
     * Абсолютный нормализованный путь к корневой директории хранилища.
     */
    private Path rootLocation;

    public LocalFileStorageService(StorageProperties properties) {
        this.properties = properties;
    }

    @PostConstruct
    void init() {
        Path basePath = properties.getBasePath();
        if (basePath == null) {
            basePath = Path.of("storage");
        }

        this.rootLocation = basePath.toAbsolutePath().normalize();
        log.info("Initializing LocalFileStorageService at '{}'", this.rootLocation);

        try {
            Files.createDirectories(this.rootLocation);
        } catch (IOException e) {
            throw new StorageException("Could not initialize storage directory: " + this.rootLocation, e);
        }
    }

    @Override
    public String save(MultipartFile file, String subDirectory) {
        if (file == null || file.isEmpty()) {
            throw new StorageException("Cannot store empty file");
        }

        Path destinationDir = resolveSubDirectory(subDirectory);

        try {
            Files.createDirectories(destinationDir);
        } catch (IOException e) {
            throw new StorageException("Could not create directory for file storage: " + destinationDir, e);
        }

        String originalFilename = cleanFilename(file.getOriginalFilename());
        String extension = getFileExtension(originalFilename);
        String generatedName = UUID.randomUUID().toString() + (extension.isBlank() ? "" : "." + extension);

        Path destinationFile = destinationDir.resolve(generatedName).normalize();

        // Дополнительная защита от выхода за пределы rootLocation
        ensureWithinRoot(destinationFile);

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new StorageException("Failed to store file: " + originalFilename, e);
        }

        // Возвращаем относительный путь относительно rootLocation
        Path relativePath = rootLocation.relativize(destinationFile);
        String storagePath = relativePath.toString().replace(File.separatorChar, '/');

        log.debug("Stored file '{}' as '{}' (subDirectory='{}')", originalFilename, storagePath, subDirectory);

        return storagePath;
    }

    @Override
    public StoredFile load(String storagePath) {
        if (storagePath == null || storagePath.isBlank()) {
            throw new StorageException("Storage path must not be empty");
        }

        Path filePath = resolvePath(storagePath);

        if (!Files.exists(filePath)) {
            throw new StorageException("File not found: " + storagePath);
        }

        ensureWithinRoot(filePath);

        Resource resource;
        try {
            resource = new UrlResource(filePath.toUri());
        } catch (MalformedURLException e) {
            throw new StorageException("Could not read file: " + storagePath, e);
        }

        if (!resource.exists() || !resource.isReadable()) {
            throw new StorageException("File is not readable: " + storagePath);
        }

        long size;
        try {
            size = Files.size(filePath);
        } catch (IOException e) {
            throw new StorageException("Could not determine file size: " + storagePath, e);
        }

        String contentType = null;
        try {
            contentType = Files.probeContentType(filePath);
        } catch (IOException e) {
            log.warn("Could not determine content type for '{}': {}", storagePath, e.getMessage());
        }
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        String filename = filePath.getFileName().toString();

        return new StoredFile(resource, filename, size, contentType);
    }

    @Override
    public void delete(String storagePath) {
        if (storagePath == null || storagePath.isBlank()) {
            return;
        }

        Path filePath = resolvePath(storagePath);

        ensureWithinRoot(filePath);

        try {
            boolean deleted = Files.deleteIfExists(filePath);
            if (deleted) {
                log.debug("Deleted file '{}'", storagePath);
            } else {
                log.debug("File '{}' does not exist, nothing to delete", storagePath);
            }
        } catch (IOException e) {
            // Не ломаем основной флоу, только логируем предупреждение
            log.warn("Failed to delete file '{}': {}", storagePath, e.getMessage());
        }
    }

    private Path resolveSubDirectory(String subDirectory) {
        if (subDirectory == null || subDirectory.isBlank()) {
            return rootLocation;
        }

        Path dir = rootLocation.resolve(subDirectory).normalize();
        ensureWithinRoot(dir);
        return dir;
    }

    private Path resolvePath(String storagePath) {
        Path path = rootLocation.resolve(storagePath).normalize();
        return path;
    }

    private void ensureWithinRoot(Path path) {
        if (!path.startsWith(rootLocation)) {
            throw new StorageException("Attempt to access file outside of storage root: " + path);
        }
    }

    private String cleanFilename(String filename) {
        String value = Objects.requireNonNullElse(filename, "file");
        // Убираем потенциально опасные элементы пути
        value = value.replace("\\", "/");
        int lastSlash = value.lastIndexOf('/');
        if (lastSlash >= 0) {
            value = value.substring(lastSlash + 1);
        }
        return value;
    }

    private String getFileExtension(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex <= 0 || dotIndex == filename.length() - 1) {
            return "";
        }
        return filename.substring(dotIndex + 1);
    }
}
