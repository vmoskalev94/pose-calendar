package com.pz4sync.posecalendar.api.dto;

import com.pz4sync.posecalendar.domain.PackType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PackCreateRequest(
        @NotBlank
        String nameRu,
        String nameEn,
        @NotNull
        PackType type,
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
