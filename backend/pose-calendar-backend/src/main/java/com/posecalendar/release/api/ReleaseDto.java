package com.posecalendar.release.api;

import com.posecalendar.release.ReleaseStatus;

import java.time.LocalDateTime;
import java.util.List;

public record ReleaseDto(
        Long id,
        Long packId,
        String packName,
        String title,
        LocalDateTime releaseDateTime,
        ReleaseStatus status,
        String notes,
        List<ReleasePlatformDto> platforms
) {
}
