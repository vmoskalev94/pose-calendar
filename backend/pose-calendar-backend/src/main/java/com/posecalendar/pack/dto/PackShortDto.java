package com.posecalendar.pack.dto;

import com.posecalendar.pack.PackType;
import com.posecalendar.pack.PackStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PackShortDto {

    private Long id;

    private String titleRu;

    private String titleEn;

    private PackType packType;

    private PackStatus status;

    private Integer posesCount;

    private boolean allInOne;

    private Instant createdAt;

    private Instant updatedAt;

    /**
     * Для прогресса чек-листа.
     */
    private int completedTasks;

    private int totalTasks;
}
