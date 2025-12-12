package com.posecalendar.pack;

import com.posecalendar.auth.AuthService;
import com.posecalendar.pack.dto.*;
import com.posecalendar.pack.dto.PackPlatformUpdateRequest;
import com.posecalendar.user.User;
import com.posecalendar.user.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
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

    /**
     * Получить список платформ для указанного пака текущего пользователя.
     */
    @GetMapping("/{packId}/platforms")
    public List<PackPlatformDto> getPackPlatforms(@PathVariable Long packId) {
        var currentUser = getCurrentUser();
        return packService.getPlatformsForPack(packId, currentUser);
    }

    /**
     * Обновить состояние платформы пака (статус, даты, заметки).
     */
    @PutMapping("/platforms/{platformId}")
    public PackPlatformDto updatePackPlatform(
            @PathVariable Long platformId,
            @Valid @RequestBody PackPlatformUpdateRequest request
    ) {
        var currentUser = getCurrentUser();
        return packService.updatePackPlatform(platformId, currentUser, request);
    }

    /**
     * Вернуть паки текущего пользователя для календаря
     * в заданном диапазоне дат (from/to включительно).
     *
     * Пример: GET /api/packs/calendar?from=2025-01-01&to=2025-01-31
     */
    @GetMapping("/calendar")
    public List<PackShortDto> getPacksForCalendar(
            @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam("to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        var currentUser = getCurrentUser();
        return packService.getPacksForCalendar(currentUser, from, to);
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
