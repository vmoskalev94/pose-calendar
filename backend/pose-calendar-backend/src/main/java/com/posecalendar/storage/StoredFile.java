package com.posecalendar.storage;

import org.springframework.core.io.Resource;

/**
 * Результат загрузки файла из хранилища.
 * <p>
 * Используется в контроллерах для отдачи файла через ResponseEntity.
 */
public record StoredFile(
        Resource resource,
        String filename,
        long contentLength,
        String contentType
) {
}
