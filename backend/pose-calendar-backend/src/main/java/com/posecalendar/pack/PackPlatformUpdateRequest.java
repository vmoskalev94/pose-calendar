package com.posecalendar.pack.dto;

import com.posecalendar.pack.PackPlatformStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * Запрос на обновление состояния пака на платформе.
 */
@Data
public class PackPlatformUpdateRequest {

    @NotNull
    private PackPlatformStatus status;

    /**
     * Запланированная дата/время публикации на платформе (может быть null).
     */
    private LocalDateTime plannedDateTime;

    /**
     * Фактическая дата/время публикации (может быть null).
     */
    private LocalDateTime publishedDateTime;

    /**
     * Заметки по этой платформе.
     */
    private String notes;
}
