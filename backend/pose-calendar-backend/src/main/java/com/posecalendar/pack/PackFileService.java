package com.posecalendar.pack;

import com.posecalendar.pack.dto.PackFileDto;
import com.posecalendar.storage.FileStorageService;
import com.posecalendar.storage.StoredFile;
import com.posecalendar.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PackFileService {

    private final PackRepository packRepository;
    private final PackFileRepository packFileRepository;
    private final PackFileMapper packFileMapper;
    private final FileStorageService fileStorageService;

    // ------------------------------------------------------------------------
    // Публичные методы
    // ------------------------------------------------------------------------

    @Transactional(readOnly = true)
    public List<PackFileDto> listPackFiles(Long packId, User currentUser) {
        Pack pack = findUserPackOrThrow(packId, currentUser);

        List<PackFile> files = packFileRepository.findByPackIdOrderByCreatedAtAsc(pack.getId());

        return packFileMapper.toDtos(files);
    }

    @Transactional
    public PackFileDto uploadPackFile(
            Long packId,
            PackFileType fileType,
            MultipartFile file,
            User currentUser
    ) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File must not be empty");
        }

        Pack pack = findUserPackOrThrow(packId, currentUser);

        String subDirectory = buildSubDirectory(currentUser, pack, fileType);

        String storagePath = fileStorageService.save(file, subDirectory);

        PackFile packFile = PackFile.builder()
                .pack(pack)
                .fileType(fileType)
                .storagePath(storagePath)
                .originalFilename(defaultOriginalFilename(file))
                .contentType(file.getContentType())
                .sizeBytes(file.getSize())
                .build();

        packFile = packFileRepository.save(packFile);

        return packFileMapper.toDto(packFile);
    }

    @Transactional(readOnly = true)
    public StoredFile getFileContent(UUID fileId, User currentUser) {
        PackFile packFile = findUserFileOrThrow(fileId, currentUser);

        return fileStorageService.load(packFile.getStoragePath());
    }

    @Transactional(readOnly = true)
    public StoredFile getFileContentPublic(UUID fileId) {
        PackFile packFile = packFileRepository.findById(fileId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found"));

        return fileStorageService.load(packFile.getStoragePath());
    }

    @Transactional
    public void deleteFile(UUID fileId, User currentUser) {
        PackFile packFile = findUserFileOrThrow(fileId, currentUser);

        // сначала удаляем физический файл (если не получится — просто залогируется warning)
        fileStorageService.delete(packFile.getStoragePath());

        // затем удаляем запись
        packFileRepository.delete(packFile);
    }

    // ------------------------------------------------------------------------
    // Внутренняя логика
    // ------------------------------------------------------------------------

    private Pack findUserPackOrThrow(Long packId, User currentUser) {
        Pack pack = packRepository.findById(packId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pack not found"));

        if (!Objects.equals(pack.getOwner().getId(), currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access to pack denied");
        }

        return pack;
    }

    private PackFile findUserFileOrThrow(UUID fileId, User currentUser) {
        PackFile packFile = packFileRepository.findById(fileId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found"));

        Pack pack = packFile.getPack();
        if (!Objects.equals(pack.getOwner().getId(), currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access to file denied");
        }

        return packFile;
    }

    private String buildSubDirectory(User currentUser, Pack pack, PackFileType fileType) {
        // Пример структуры:
        // users/{userId}/packs/{packId}/{fileType}
        return "users/" + currentUser.getId()
                + "/packs/" + pack.getId()
                + "/" + fileType.name().toLowerCase();
    }

    private String defaultOriginalFilename(MultipartFile file) {
        String original = file.getOriginalFilename();
        if (original == null || original.isBlank()) {
            return "file";
        }
        return original;
    }
}
