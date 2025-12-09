package com.posecalendar.release.api;

public record PostDraftDto(
        Long id,
        String title,
        String body,
        String hashtags,
        String language
) {
}
