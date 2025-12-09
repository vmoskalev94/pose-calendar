package com.posecalendar.release.api;

import com.posecalendar.release.ReleaseStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public record CreateReleaseRequest(
        @NotNull
        Long packId,

        @NotNull
        @Size(min = 1, max = 255)
        String title,

        @NotNull
        LocalDateTime releaseDateTime,

        ReleaseStatus status,

        @Size(max = 2000)
        String notes
) {
}
