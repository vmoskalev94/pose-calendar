package com.posecalendar.pack.dto;

import com.posecalendar.pack.PackStatus;
import com.posecalendar.pack.PackType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PackUpdateRequest {

    @NotBlank
    @Size(max = 255)
    private String titleRu;

    @Size(max = 255)
    private String titleEn;

    @Size(max = 2000)
    private String description;

    @NotNull
    private PackType packType;

    @PositiveOrZero
    private Integer posesCount;

    @NotNull
    private Boolean allInOne;

    @Size(max = 2000)
    private String hashtags;

    @Size(max = 2000)
    private String requirements;

    /**
     * Разрешим менять статус пака (DRAFT → IN_PROGRESS → READY_FOR_RELEASE → ...).
     */
    @NotNull
    private PackStatus status;
}
