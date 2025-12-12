package com.posecalendar.pack.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Запрос на создание/обновление черновика поста.
 */
@Data
public class PackPostDraftRequest {

    @Size(max = 255)
    private String title;

    @Size(max = 5000)
    private String body;

    @Size(max = 1000)
    private String hashtags;

    @Size(max = 32)
    private String language;
}
