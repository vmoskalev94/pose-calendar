package com.posecalendar.pack.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PackTaskUpdateRequest {

    /**
     * Можно изменить текст задачи (необязательно).
     */
    @Size(max = 255)
    private String title;

    /**
     * Состояние чекбокса.
     */
    private Boolean completed;
}
