package com.posecalendar.storage;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;

class LocalFileStorageServiceTest {

    @TempDir
    Path tempDir;

    private LocalFileStorageService storageService;

    @BeforeEach
    void setUp() {
        StorageProperties properties = new StorageProperties();
        properties.setBasePath(tempDir);

        storageService = new LocalFileStorageService(properties);
        storageService.init(); // @PostConstruct-метод, доступен из того же пакета
    }

    @Test
    void saveAndLoadFile() throws Exception {
        MockMultipartFile multipartFile = new MockMultipartFile(
                "file",
                "test.txt",
                "text/plain",
                "hello world".getBytes()
        );

        String storagePath = storageService.save(multipartFile, "test-subdir");

        assertNotNull(storagePath);
        assertFalse(storagePath.isBlank());

        Path storedPath = tempDir.resolve(storagePath);
        assertTrue(Files.exists(storedPath));

        StoredFile storedFile = storageService.load(storagePath);

        assertNotNull(storedFile);
        assertEquals(Files.size(storedPath), storedFile.contentLength());
        assertEquals("text/plain", storedFile.contentType());
        assertTrue(storedFile.filename().endsWith(".txt"));
    }

    @Test
    void deleteFileShouldRemoveIt() throws Exception {
        MockMultipartFile multipartFile = new MockMultipartFile(
                "file",
                "test.txt",
                "text/plain",
                "hello world".getBytes()
        );

        String storagePath = storageService.save(multipartFile, null);

        Path storedPath = tempDir.resolve(storagePath);
        assertTrue(Files.exists(storedPath));

        storageService.delete(storagePath);

        assertFalse(Files.exists(storedPath));
    }
}
