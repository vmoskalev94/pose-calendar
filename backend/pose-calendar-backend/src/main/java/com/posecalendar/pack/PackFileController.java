package com.posecalendar.pack;

import com.posecalendar.pack.dto.PackFileDto;
import com.posecalendar.storage.StoredFile;
import com.posecalendar.user.User;
import com.posecalendar.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/packs")
@RequiredArgsConstructor
public class PackFileController {

    private final PackFileService packFileService;
    private final UserRepository userRepository;

    // ------------------------------------------------------------------------
    // API
    // ------------------------------------------------------------------------

    /**
     * Загрузка файла пака.
     */
    @PostMapping(
            path = "/{packId}/files",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<PackFileDto> uploadFile(
            @PathVariable("packId") Long packId,
            @RequestParam("fileType") PackFileType fileType,
            @RequestParam("file") MultipartFile file
    ) {
        User currentUser = getCurrentUser();

        PackFileDto dto = packFileService.uploadPackFile(packId, fileType, file, currentUser);

        return ResponseEntity.ok(dto);
    }

    /**
     * Список файлов пака.
     */
    @GetMapping("/{packId}/files")
    public ResponseEntity<List<PackFileDto>> listFiles(
            @PathVariable("packId") Long packId
    ) {
        User currentUser = getCurrentUser();

        List<PackFileDto> files = packFileService.listPackFiles(packId, currentUser);

        return ResponseEntity.ok(files);
    }

    /**
     * Скачивание файла пака.
     */
    @GetMapping("/files/{fileId}")
    public ResponseEntity<Resource> downloadFile(
            @PathVariable("fileId") UUID fileId
    ) {
        User currentUser = getCurrentUser();

        StoredFile storedFile = packFileService.getFileContent(fileId, currentUser);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(storedFile.contentType()));
        headers.setContentLength(storedFile.contentLength());
        headers.setContentDisposition(
                ContentDisposition.attachment()
                        .filename(storedFile.filename(), StandardCharsets.UTF_8)
                        .build()
        );

        return ResponseEntity.ok()
                .headers(headers)
                .body(storedFile.resource());
    }

    /**
     * Удаление файла пака.
     */
    @DeleteMapping("/files/{fileId}")
    public ResponseEntity<Void> deleteFile(
            @PathVariable("fileId") UUID fileId
    ) {
        User currentUser = getCurrentUser();

        packFileService.deleteFile(fileId, currentUser);

        return ResponseEntity.noContent().build();
    }

    // ------------------------------------------------------------------------
    // Вспомогательный метод — такой же, как в PackController
    // ------------------------------------------------------------------------

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found: " + username));
    }
}
