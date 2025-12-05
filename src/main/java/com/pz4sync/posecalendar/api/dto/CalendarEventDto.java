package com.pz4sync.posecalendar.api.dto;

import com.pz4sync.posecalendar.domain.PackStatus;
import com.pz4sync.posecalendar.domain.PackType;

import java.time.LocalDateTime;

public record CalendarEventDto(
        Long releaseId,
        Long packId,
        String packNameRu,
        String packNameEn,
        PackType packType,
        PackStatus packStatus,
        LocalDateTime releaseDateTime,
        boolean telegramPlanned,
        boolean vkPlanned,
        boolean boostyPlanned,
        boolean tumblrPlanned
) {
}
