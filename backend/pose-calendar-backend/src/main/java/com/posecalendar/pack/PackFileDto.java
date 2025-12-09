// src/main/java/com/posecalendar/pack/dto/PackFileDto.java
package com.posecalendar.pack.dto;

import com.posecalendar.pack.PackFileType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PackFileDto {

    private UUID id;

    private PackFileType fileType;

    private String originalFilename;

    private String contentType;

    private long sizeBytes;

    private Instant createdAt;
}
