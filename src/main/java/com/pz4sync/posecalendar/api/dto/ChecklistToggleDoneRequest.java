package com.pz4sync.posecalendar.api.dto;

import jakarta.validation.constraints.NotNull;

public record ChecklistToggleDoneRequest(
        @NotNull
        Boolean done
) {
}
