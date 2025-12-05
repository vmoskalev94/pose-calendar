package com.pz4sync.posecalendar.api.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record ReleaseCreateRequest(
        @NotNull
        LocalDateTime releaseDateTime,
        boolean telegramPlanned,
        boolean vkPlanned,
        boolean boostyPlanned,
        boolean tumblrPlanned
) {
}
