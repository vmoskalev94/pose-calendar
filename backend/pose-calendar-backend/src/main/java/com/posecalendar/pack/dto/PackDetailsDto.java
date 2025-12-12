// src/main/java/com/posecalendar/pack/dto/PackDetailsDto.java
package com.posecalendar.pack.dto;

import com.posecalendar.pack.PackStatus;
import com.posecalendar.pack.PackType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PackDetailsDto {

    private Long id;

    private String titleRu;

    private String titleEn;

    private String description;

    private PackType packType;

    private PackStatus status;

    private Integer posesCount;

    private boolean allInOne;

    private String hashtags;

    private String requirements;

    private Instant createdAt;

    private Instant updatedAt;

    private LocalDateTime plannedReleaseAt;

    private List<PackTaskDto> tasks;
}
