package com.posecalendar.release.api;

import com.posecalendar.release.ReleaseStatus;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

/**
 * Частичное обновление релиза.
 * Все поля опциональны.
 */
public record UpdateReleaseRequest(
        Long packId,
        @Size(min = 1, max = 255)
        String title,
        LocalDateTime releaseDateTime,
        ReleaseStatus status,
        @Size(max = 2000)
        String notes
) {
}
