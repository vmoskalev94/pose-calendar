package com.pz4sync.posecalendar.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ChecklistAddItemRequest(
        @NotBlank
        String title,
        @NotNull
        Integer orderIndex
) {
}
