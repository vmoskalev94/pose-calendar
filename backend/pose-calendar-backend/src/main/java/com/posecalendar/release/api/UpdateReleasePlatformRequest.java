package com.posecalendar.release.api;

import com.posecalendar.release.ReleasePlatformStatus;

import java.time.LocalDateTime;

public record UpdateReleasePlatformRequest(
        ReleasePlatformStatus status,
        LocalDateTime plannedDateTime,
        LocalDateTime publishedDateTime,
        String notes
) {
}
