package com.posecalendar.pack.dto;

import com.posecalendar.pack.PackType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class PackCreateRequest {

    @NotBlank
    @Size(max = 255)
    private String titleRu;

    @Size(max = 255)
    private String titleEn;

    @Size(max = 2000)
    private String description;

    @NotNull
    private PackType packType;

    /**
     * Опциональная планируемая дата/время релиза пака.
     */
    private LocalDateTime plannedReleaseAt;

    @PositiveOrZero
    private Integer posesCount;

    /**
     * По умолчанию false, если не передан.
     */
    private Boolean allInOne = Boolean.FALSE;

    @Size(max = 2000)
    private String hashtags;

    @Size(max = 2000)
    private String requirements;
}
