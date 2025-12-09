package com.posecalendar.release.api;

import com.posecalendar.platform.Platform;
import com.posecalendar.release.PostDraft;
import com.posecalendar.release.Release;
import com.posecalendar.release.ReleasePlatform;
import com.posecalendar.release.ReleaseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/releases")
@RequiredArgsConstructor
public class ReleaseController {

    private final ReleaseService releaseService;

    /**
     * Получить релизы текущего пользователя в диапазоне дат (для календаря).
     * <p>
     * Пример:
     * GET /api/releases?ownerId=1&from=2025-12-01&to=2025-12-31
     */
    @GetMapping
    public List<ReleaseDto> getReleasesForRange(
            // TODO: заменить на id из security-контекста
            @RequestParam("ownerId") Long ownerId,
            @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam("to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        LocalDateTime fromDateTime = from.atStartOfDay();
        LocalDateTime toDateTime = to.plusDays(1).atStartOfDay().minusNanos(1);

        List<Release> releases = releaseService.getReleasesForOwnerBetween(
                ownerId,
                fromDateTime,
                toDateTime
        );

        return releases.stream()
                .map(ReleaseMapper::toDto)
                .toList();
    }

    /**
     * Получить один релиз по id.
     */
    @GetMapping("/{id}")
    public ReleaseDto getRelease(
            @RequestParam("ownerId") Long ownerId,
            @PathVariable("id") Long id
    ) {
        Release release = releaseService.getReleaseForOwner(id, ownerId);
        return ReleaseMapper.toDto(release);
    }

    /**
     * Создать новый релиз.
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReleaseDto createRelease(
            @RequestParam("ownerId") Long ownerId,
            @Valid @RequestBody CreateReleaseRequest request
    ) {
        Release release = releaseService.createRelease(ownerId, request);
        return ReleaseMapper.toDto(release);
    }

    /**
     * Обновить релиз.
     */
    @PutMapping("/{id}")
    public ReleaseDto updateRelease(
            @RequestParam("ownerId") Long ownerId,
            @PathVariable("id") Long id,
            @Valid @RequestBody UpdateReleaseRequest request
    ) {
        Release release = releaseService.updateRelease(ownerId, id, request);
        return ReleaseMapper.toDto(release);
    }

    /**
     * Удалить релиз.
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRelease(
            @RequestParam("ownerId") Long ownerId,
            @PathVariable("id") Long id
    ) {
        releaseService.deleteRelease(ownerId, id);
    }

    // ------------------------------------------------------------------------
    // Platforms
    // ------------------------------------------------------------------------

    /**
     * Получить платформы релиза.
     */
    @GetMapping("/{id}/platforms")
    public List<ReleasePlatformDto> getPlatforms(
            @RequestParam("ownerId") Long ownerId,
            @PathVariable("id") Long releaseId
    ) {
        List<ReleasePlatform> platforms =
                releaseService.getPlatformsForRelease(ownerId, releaseId);

        return platforms.stream()
                .map(ReleaseMapper::toDto)
                .toList();
    }

    /**
     * Создать/обновить состояние платформы релиза.
     * <p>
     * Пример:
     * PUT /api/releases/{id}/platforms/TELEGRAM
     */
    @PutMapping("/{id}/platforms/{platform}")
    public ReleasePlatformDto upsertPlatform(
            @RequestParam("ownerId") Long ownerId,
            @PathVariable("id") Long releaseId,
            @PathVariable("platform") Platform platform,
            @Valid @RequestBody UpdateReleasePlatformRequest request
    ) {
        ReleasePlatform entity = releaseService.upsertPlatformForRelease(
                ownerId,
                releaseId,
                platform,
                request
        );
        return ReleaseMapper.toDto(entity);
    }

    // ------------------------------------------------------------------------
    // Post drafts
    // ------------------------------------------------------------------------

    /**
     * Получить черновик поста по id платформы релиза.
     */
    @GetMapping("/platforms/{releasePlatformId}/post-draft")
    public PostDraftDto getPostDraft(
            @RequestParam("ownerId") Long ownerId,
            @PathVariable("releasePlatformId") Long releasePlatformId
    ) {
        PostDraft draft = releaseService.getPostDraftForPlatform(ownerId, releasePlatformId);
        return ReleaseMapper.toDto(draft);
    }

    /**
     * Создать/обновить черновик поста.
     */
    @PutMapping("/platforms/{releasePlatformId}/post-draft")
    public PostDraftDto upsertPostDraft(
            @RequestParam("ownerId") Long ownerId,
            @PathVariable("releasePlatformId") Long releasePlatformId,
            @Valid @RequestBody UpsertPostDraftRequest request
    ) {
        PostDraft draft = releaseService.upsertPostDraft(ownerId, releasePlatformId, request);
        return ReleaseMapper.toDto(draft);
    }
}
