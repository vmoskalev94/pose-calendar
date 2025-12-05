package com.pz4sync.posecalendar.api.dto;

public record ChecklistItemDto(
        Long id,
        Long packId,
        String title,
        boolean done,
        Integer orderIndex
) {
}
