package com.posecalendar.pack;

import com.posecalendar.pack.dto.*;
import com.posecalendar.pack.dto.PackPlatformUpdateRequest;
import com.posecalendar.user.User;
import io.jsonwebtoken.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class PackService {

    private final PackRepository packRepository;
    private final PackTaskRepository packTaskRepository;
    private final PackMapper packMapper;
    private final PackPlatformRepository packPlatformRepository;


    /**
     * Получить список паков текущего пользователя.
     */
    @Transactional(readOnly = true)
    public List<PackShortDto> getPacksForUser(User currentUser) {
        List<Pack> packs = packRepository.findAllByOwnerIdOrderByCreatedAtDesc(currentUser.getId());
        return packMapper.toShortDtoList(packs);
    }

    /**
     * Получить список платформ для конкретного пака текущего пользователя.
     */
    @Transactional(readOnly = true)
    public List<PackPlatformDto> getPlatformsForPack(Long packId, User currentUser) {
        // проверяем, что пак принадлежит пользователю (и существует)
        Pack pack = findPackOwnedByUserOrThrow(packId, currentUser);

        // Можно использовать либо pack.getPlatforms(), либо репозиторий.
        // Так как у нас уже есть связь OneToMany, достаточно коллекции из сущности.
        return pack.getPlatforms().stream()
                .map(packMapper::toPlatformDto)
                .toList();

        // Альтернатива через репозиторий (если вдруг коллекция лениво не загружается):
        // List<PackPlatform> platforms = packPlatformRepository.findAllByPackId(pack.getId());
        // return platforms.stream()
        //         .map(packMapper::toPlatformDto)
        //         .toList();
    }

    /**
     * Обновить состояние платформы для пака текущего пользователя.
     */
    @Transactional
    public PackPlatformDto updatePackPlatform(Long platformId, User currentUser, PackPlatformUpdateRequest request) {
        // Загружаем платформу
        PackPlatform platform = packPlatformRepository.findById(platformId)
                .orElseThrow(() -> new IOException("Pack platform not found: id=" + platformId));

        Pack pack = platform.getPack();
        if (!pack.getOwner().getId().equals(currentUser.getId())) {
            // Поведение как и в других методах — NotFound вместо Forbidden,
            // чтобы не светить существование чужих паков.
            throw new IOException("Pack platform not found for current user: id=" + platformId);
        }

        // Обновляем поле состояния
        platform.setStatus(request.getStatus());
        platform.setPlannedDateTime(request.getPlannedDateTime());
        platform.setPublishedDateTime(request.getPublishedDateTime());
        platform.setNotes(request.getNotes());

        // Сохраняем изменения
        PackPlatform saved = packPlatformRepository.save(platform);

        // Маппим в DTO
        return packMapper.toPlatformDto(saved);
    }

    /**
     * Получить конкретный пак текущего пользователя.
     */
    @Transactional(readOnly = true)
    public PackDetailsDto getPackByIdForUser(Long packId, User currentUser) {
        Pack pack = findPackOwnedByUserOrThrow(packId, currentUser);
        return packMapper.toDetailsDto(pack);
    }

    /**
     * Создание пака:
     * - создаём сущность Pack в статусе DRAFT
     * - создаём дефолтный чек-лист задач по PackTaskType
     */
    @Transactional
    public PackDetailsDto createPack(PackCreateRequest request, User currentUser) {
        Pack pack = packMapper.toEntityForCreate(request, currentUser, PackStatus.DRAFT);

        // генерируем дефолтные задачи
        createDefaultTasksForPack(pack);

        Pack saved = packRepository.save(pack);
        return packMapper.toDetailsDto(saved);
    }

    /**
     * Обновление пака текущего пользователя.
     */
    @Transactional
    public PackDetailsDto updatePack(Long packId, PackUpdateRequest request, User currentUser) {
        Pack pack = findPackOwnedByUserOrThrow(packId, currentUser);

        packMapper.updatePackFromRequest(pack, request);

        Pack saved = packRepository.save(pack);
        return packMapper.toDetailsDto(saved);
    }

    /**
     * Удаление пака (со всеми задачами).
     */
    @Transactional
    public void deletePack(Long packId, User currentUser) {
        Pack pack = findPackOwnedByUserOrThrow(packId, currentUser);
        packRepository.delete(pack);
    }

    /**
     * Получить задачи конкретного пака.
     */
    @Transactional(readOnly = true)
    public List<PackTaskDto> getTasksForPack(Long packId, User currentUser) {
        // проверяем, что пак принадлежит пользователю (и существует)
        Pack pack = findPackOwnedByUserOrThrow(packId, currentUser);

        return pack.getTasks().stream()
                .map(packMapper::toTaskDto)
                .toList();
    }

    /**
     * Обновление отдельной задачи чек-листа:
     * - можно поменять title
     * - можно переключить completed
     */
    @Transactional
    public PackTaskDto updateTask(Long taskId, PackTaskUpdateRequest request, User currentUser) {
        PackTask task = packTaskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pack task not found"));

        // проверяем, что задача принадлежит паку текущего пользователя
        if (!Objects.equals(task.getPack().getOwner().getId(), currentUser.getId())) {
            // маскируем чужие сущности под 404 — не говорим, что они существуют
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Pack task not found");
        }

        if (request.getTitle() != null) {
            task.setTitle(request.getTitle());
        }

        if (request.getCompleted() != null) {
            boolean newCompleted = request.getCompleted();
            boolean oldCompleted = task.isCompleted();

            task.setCompleted(newCompleted);

            if (newCompleted && !oldCompleted) {
                task.setCompletedAt(Instant.now());
            } else if (!newCompleted && oldCompleted) {
                task.setCompletedAt(null);
            }
        }

        PackTask saved = packTaskRepository.save(task);
        return packMapper.toTaskDto(saved);
    }

    /**
     * Найти паки текущего пользователя для отображения в календаре
     * в заданном диапазоне дат (from/to включительно).
     */
    @Transactional(readOnly = true)
    public List<PackShortDto> getPacksForCalendar(User currentUser, LocalDate from, LocalDate to) {
        Long ownerId = currentUser.getId();

        // интервал [from; to] включительно, в терминах LocalDateTime
        LocalDateTime fromDateTime = from.atStartOfDay();
        LocalDateTime toDateTime = to.plusDays(1).atStartOfDay().minusNanos(1);

        List<Pack> packs = packRepository
                .findAllByOwnerIdAndPlannedReleaseAtBetweenOrderByPlannedReleaseAtAsc(
                        ownerId,
                        fromDateTime,
                        toDateTime
                );

        return packMapper.toShortDtoList(packs);
    }


    // ------------------------------------------------------------------------
    // Вспомогательные методы
    // ------------------------------------------------------------------------

    /**
     * Находит пак по id и проверяет, что он принадлежит текущему пользователю.
     * Если нет — кидает 404.
     */
    private Pack findPackOwnedByUserOrThrow(Long packId, User currentUser) {
        Pack pack = packRepository.findById(packId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pack not found"));

        if (!Objects.equals(pack.getOwner().getId(), currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Pack not found");
        }

        return pack;
    }

    /**
     * Генерирует дефолтный чек-лист задач для только что созданного пака.
     */
    private void createDefaultTasksForPack(Pack pack) {
        int index = 0;
        for (PackTaskType type : PackTaskType.values()) {
            PackTask task = PackTask.builder()
                    .pack(pack)
                    .taskType(type)
                    .title(type.getDefaultTitle())
                    .orderIndex(index++)
                    .completed(false)
                    .build();

            pack.addTask(task);
        }
    }
}
