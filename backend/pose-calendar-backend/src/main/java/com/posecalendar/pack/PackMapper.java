package com.posecalendar.pack;

import com.posecalendar.pack.dto.*;
import com.posecalendar.user.User;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PackMapper {

    public PackShortDto toShortDto(Pack pack) {
        int totalTasks = pack.getTasks() != null ? pack.getTasks().size() : 0;
        int completedTasks = pack.getTasks() != null
                ? (int) pack.getTasks().stream()
                .filter(PackTask::isCompleted)
                .count()
                : 0;

        return PackShortDto.builder()
                .id(pack.getId())
                .titleRu(pack.getTitleRu())
                .titleEn(pack.getTitleEn())
                .packType(pack.getPackType())
                .plannedReleaseAt(pack.getPlannedReleaseAt())
                .status(pack.getStatus())
                .posesCount(pack.getPosesCount())
                .allInOne(pack.isAllInOne())
                .createdAt(pack.getCreatedAt())
                .updatedAt(pack.getUpdatedAt())
                .completedTasks(completedTasks)
                .totalTasks(totalTasks)
                .build();
    }

    public List<PackShortDto> toShortDtoList(List<Pack> packs) {
        return packs.stream()
                .map(this::toShortDto)
                .toList();
    }

    public PackDetailsDto toDetailsDto(Pack pack) {
        return PackDetailsDto.builder()
                .id(pack.getId())
                .titleRu(pack.getTitleRu())
                .titleEn(pack.getTitleEn())
                .description(pack.getDescription())
                .packType(pack.getPackType())
                .status(pack.getStatus())
                .posesCount(pack.getPosesCount())
                .allInOne(pack.isAllInOne())
                .hashtags(pack.getHashtags())
                .requirements(pack.getRequirements())
                .createdAt(pack.getCreatedAt())
                .updatedAt(pack.getUpdatedAt())
                .plannedReleaseAt(pack.getPlannedReleaseAt())
                .tasks(
                        pack.getTasks().stream()
                                .map(this::toTaskDto)
                                .toList()
                )
                .build();
    }

    public PackTaskDto toTaskDto(PackTask task) {
        return PackTaskDto.builder()
                .id(task.getId())
                .taskType(task.getTaskType())
                .title(task.getTitle())
                .orderIndex(task.getOrderIndex())
                .completed(task.isCompleted())
                .completedAt(task.getCompletedAt())
                .build();
    }

    /**
     * Создание сущности Pack из запроса + текущего пользователя.
     * Статус задаём явно (обычно DRAFT).
     */
    public Pack toEntityForCreate(
            PackCreateRequest request,
            User owner,
            PackStatus initialStatus
    ) {
        return Pack.builder()
                .owner(owner)
                .titleRu(request.getTitleRu())
                .titleEn(request.getTitleEn())
                .description(request.getDescription())
                .packType(request.getPackType())
                .posesCount(request.getPosesCount())
                .allInOne(Boolean.TRUE.equals(request.getAllInOne()))
                .hashtags(request.getHashtags())
                .requirements(request.getRequirements())
                .status(initialStatus)
                .plannedReleaseAt(request.getPlannedReleaseAt())
                .build();
    }

    /**
     * Обновление существующего Pack из запроса.
     */
    public void updatePackFromRequest(Pack pack, PackUpdateRequest request) {
        pack.setTitleRu(request.getTitleRu());
        pack.setTitleEn(request.getTitleEn());
        pack.setDescription(request.getDescription());
        pack.setPackType(request.getPackType());
        pack.setPosesCount(request.getPosesCount());
        pack.setAllInOne(Boolean.TRUE.equals(request.getAllInOne()));
        pack.setHashtags(request.getHashtags());
        pack.setRequirements(request.getRequirements());
        pack.setPlannedReleaseAt(request.getPlannedReleaseAt());
        pack.setStatus(request.getStatus());
    }

    /**
     * Преобразование сущности PackPlatform в DTO.
     * Пока без черновика (postDraft) — его добавим позже, когда перенесём PostDraft на PackPlatform.
     */
    public PackPlatformDto toPlatformDto(PackPlatform platform) {
        if (platform == null) {
            return null;
        }

        return PackPlatformDto.builder()
                .id(platform.getId())
                .packId(platform.getPack() != null ? platform.getPack().getId() : null)
                .platform(platform.getPlatform())
                .status(platform.getStatus())
                .plannedDateTime(platform.getPlannedDateTime())
                .publishedDateTime(platform.getPublishedDateTime())
                .notes(platform.getNotes())
                .createdAt(platform.getCreatedAt())
                .updatedAt(platform.getUpdatedAt())
                .postDraft(null) // временно null — позже сюда придёт PackPostDraftDto
                .build();
    }

    public List<PackPlatformDto> toPlatformDtoList(List<PackPlatform> platforms) {
        return platforms.stream()
                .map(this::toPlatformDto)
                .toList();
    }
}
