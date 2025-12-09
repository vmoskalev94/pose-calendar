package com.posecalendar.pack;

import com.posecalendar.pack.dto.PackCreateRequest;
import com.posecalendar.pack.dto.PackDetailsDto;
import com.posecalendar.pack.dto.PackShortDto;
import com.posecalendar.pack.dto.PackTaskDto;
import com.posecalendar.pack.dto.PackTaskUpdateRequest;
import com.posecalendar.pack.dto.PackUpdateRequest;
import com.posecalendar.user.User;
import com.posecalendar.user.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/packs")
@RequiredArgsConstructor
public class PackController {

    private final PackService packService;
    private final UserRepository userRepository;

    /**
     * Список паков текущего пользователя (для правой панели и т.п.).
     */
    @GetMapping
    public ResponseEntity<List<PackShortDto>> getMyPacks() {
        User currentUser = getCurrentUser();
        List<PackShortDto> packs = packService.getPacksForUser(currentUser);
        return ResponseEntity.ok(packs);
    }

    /**
     * Детальная карточка пака.
     */
    @GetMapping("/{id}")
    public ResponseEntity<PackDetailsDto> getPack(@PathVariable("id") Long packId) {
        User currentUser = getCurrentUser();
        PackDetailsDto pack = packService.getPackByIdForUser(packId, currentUser);
        return ResponseEntity.ok(pack);
    }

    /**
     * Создание нового пака.
     */
    @PostMapping
    public ResponseEntity<PackDetailsDto> createPack(@Valid @RequestBody PackCreateRequest request) {
        User currentUser = getCurrentUser();
        PackDetailsDto created = packService.createPack(request, currentUser);
        return ResponseEntity.status(201).body(created);
    }

    /**
     * Обновление существующего пака.
     */
    @PutMapping("/{id}")
    public ResponseEntity<PackDetailsDto> updatePack(
            @PathVariable("id") Long packId,
            @Valid @RequestBody PackUpdateRequest request
    ) {
        User currentUser = getCurrentUser();
        PackDetailsDto updated = packService.updatePack(packId, request, currentUser);
        return ResponseEntity.ok(updated);
    }

    /**
     * Удаление пака.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePack(@PathVariable("id") Long packId) {
        User currentUser = getCurrentUser();
        packService.deletePack(packId, currentUser);
        return ResponseEntity.noContent().build();
    }

    /**
     * Список задач чек-листа для конкретного пака.
     */
    @GetMapping("/{id}/tasks")
    public ResponseEntity<List<PackTaskDto>> getPackTasks(@PathVariable("id") Long packId) {
        User currentUser = getCurrentUser();
        List<PackTaskDto> tasks = packService.getTasksForPack(packId, currentUser);
        return ResponseEntity.ok(tasks);
    }

    /**
     * Обновление отдельной задачи чек-листа (изменить текст / переключить completed).
     */
    @PatchMapping("/tasks/{taskId}")
    public ResponseEntity<PackTaskDto> updateTask(
            @PathVariable("taskId") Long taskId,
            @Valid @RequestBody PackTaskUpdateRequest request
    ) {
        User currentUser = getCurrentUser();
        PackTaskDto updated = packService.updateTask(taskId, request, currentUser);
        return ResponseEntity.ok(updated);
    }

    // ------------------------------------------------------------------------
    // Вспомогательный метод для получения текущего пользователя
    // ------------------------------------------------------------------------

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found: " + username));
    }
}
