package com.pz4sync.posecalendar.api.dto;

import com.pz4sync.posecalendar.domain.PackStatus;
import com.pz4sync.posecalendar.domain.PackType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PackUpdateRequest(
        @NotBlank
        String nameRu,
        String nameEn,
        @NotNull
        PackType type,
        @NotNull
        PackStatus status,
        Integer posesCount,
        Integer couplePosesCount,
        String tags,
        String description,
        String sourceDir,
        String screensDir,
        String coverFile,
        String packageFile
) {
}
