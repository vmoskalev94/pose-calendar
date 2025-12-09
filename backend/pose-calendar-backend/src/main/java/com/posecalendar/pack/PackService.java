package com.posecalendar.pack;

import com.posecalendar.pack.dto.PackCreateRequest;
import com.posecalendar.pack.dto.PackDetailsDto;
import com.posecalendar.pack.dto.PackShortDto;
import com.posecalendar.pack.dto.PackTaskDto;
import com.posecalendar.pack.dto.PackTaskUpdateRequest;
import com.posecalendar.pack.dto.PackUpdateRequest;
import com.posecalendar.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class PackService {

    private final PackRepository packRepository;
    private final PackTaskRepository packTaskRepository;
    private final PackMapper packMapper;

    /**
     * Получить список паков текущего пользователя.
     */
    @Transactional(readOnly = true)
    public List<PackShortDto> getPacksForUser(User currentUser) {
        List<Pack> packs = packRepository.findAllByOwnerIdOrderByCreatedAtDesc(currentUser.getId());
        return packMapper.toShortDtoList(packs);
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
