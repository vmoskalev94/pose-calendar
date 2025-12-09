package com.posecalendar.release.api;

import com.posecalendar.platform.Platform;
import com.posecalendar.release.ReleasePlatformStatus;

import java.time.LocalDateTime;

public record ReleasePlatformDto(
        Long id,
        Platform platform,
        ReleasePlatformStatus status,
        LocalDateTime plannedDateTime,
        LocalDateTime publishedDateTime,
        String notes,
        PostDraftDto postDraft
) {
}
