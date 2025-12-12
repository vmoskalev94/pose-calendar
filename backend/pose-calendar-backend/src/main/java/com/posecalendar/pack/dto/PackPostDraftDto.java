package com.posecalendar.pack.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * DTO для черновика поста на платформе.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PackPostDraftDto {

    private Long id;

    private Long packPlatformId;

    /**
     * Заголовок поста (если используется).
     */
    private String title;

    /**
     * Основной текст поста.
     */
    private String body;

    /**
     * Хэштеги / дополнительные теги, если ты их хранишь в PostDraft.
     */
    private String hashtags;

    /**
     * Язык поста (например, "ru", "en").
     */
    private String language;

    private Instant createdAt;

    private Instant updatedAt;
}
