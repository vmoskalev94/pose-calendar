package com.pz4sync.posecalendar.api.dto;

import java.time.LocalDateTime;

public record ReleaseDto(
        Long id,
        Long packId,
        LocalDateTime releaseDateTime,
        boolean telegramPlanned,
        boolean vkPlanned,
        boolean boostyPlanned,
        boolean tumblrPlanned
) {
}
