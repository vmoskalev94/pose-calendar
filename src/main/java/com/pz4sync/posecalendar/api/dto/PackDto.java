package com.pz4sync.posecalendar.api.dto;

import com.pz4sync.posecalendar.domain.PackStatus;
import com.pz4sync.posecalendar.domain.PackType;

import java.time.Instant;

public record PackDto(
        Long id,
        String nameRu,
        String nameEn,
        PackType type,
        PackStatus status,
        Integer posesCount,
        Integer couplePosesCount,
        String tags,
        String description,
        String sourceDir,
        String screensDir,
        String coverFile,
        String packageFile,
        Instant createdAt,
        Instant updatedAt
) {
}
