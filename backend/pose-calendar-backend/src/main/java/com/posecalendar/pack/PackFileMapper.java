package com.posecalendar.pack;

import com.posecalendar.pack.dto.PackFileDto;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PackFileMapper {

    public PackFileDto toDto(PackFile entity) {
        if (entity == null) {
            return null;
        }

        return PackFileDto.builder()
                .id(entity.getId())
                .fileType(entity.getFileType())
                .originalFilename(entity.getOriginalFilename())
                .contentType(entity.getContentType())
                .sizeBytes(entity.getSizeBytes())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    public List<PackFileDto> toDtos(List<PackFile> entities) {
        return entities.stream()
                .map(this::toDto)
                .toList();
    }
}
