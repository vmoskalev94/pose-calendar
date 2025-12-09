package com.posecalendar.pack.dto;

import com.posecalendar.pack.PackTaskType;
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
public class PackTaskDto {

    private Long id;

    private PackTaskType taskType;

    private String title;

    private int orderIndex;

    private boolean completed;

    private Instant completedAt;
}
