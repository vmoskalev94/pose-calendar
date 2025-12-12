package com.posecalendar.pack.dto;

import com.posecalendar.pack.PackPlatformStatus;
import com.posecalendar.platform.Platform;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDateTime;

/**
 * DTO для состояния пака на конкретной платформе.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PackPlatformDto {

    private Long id;

    private Long packId;

    private Platform platform;

    private PackPlatformStatus status;

    /**
     * Запланированная дата/время публикации на платформе.
     */
    private LocalDateTime plannedDateTime;

    /**
     * Фактическая дата/время публикации на платформе.
     */
    private LocalDateTime publishedDateTime;

    /**
     * Заметки по этой платформе.
     */
    private String notes;

    private Instant createdAt;

    private Instant updatedAt;

    /**
     * Черновик поста (если есть).
     */
    private PackPostDraftDto postDraft;
}
