package com.posecalendar.release;

import com.posecalendar.pack.Pack;
import com.posecalendar.pack.PackRepository;
import com.posecalendar.platform.Platform;
import com.posecalendar.release.api.CreateReleaseRequest;
import com.posecalendar.release.api.UpdateReleasePlatformRequest;
import com.posecalendar.release.api.UpdateReleaseRequest;
import com.posecalendar.release.api.UpsertPostDraftRequest;
import com.posecalendar.user.User;
import com.posecalendar.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ReleaseService {

    private final ReleaseRepository releaseRepository;
    private final ReleasePlatformRepository releasePlatformRepository;
    private final PostDraftRepository postDraftRepository;
    private final UserRepository userRepository;
    private final PackRepository packRepository;

    // ------------------------------------------------------------------------
    // Releases
    // ------------------------------------------------------------------------

    @Transactional(readOnly = true)
    public List<Release> getReleasesForOwnerBetween(
            Long ownerId,
            LocalDateTime from,
            LocalDateTime to
    ) {
        return releaseRepository
                .findAllByOwnerIdAndReleaseDateTimeBetweenOrderByReleaseDateTimeAsc(
                        ownerId, from, to
                );
    }

    @Transactional(readOnly = true)
    public Release getReleaseForOwner(Long releaseId, Long ownerId) {
        Release release = releaseRepository.findById(releaseId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Release not found"
                ));

        if (!release.getOwner().getId().equals(ownerId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Release not found");
        }

        return release;
    }

    public Release createRelease(Long ownerId, CreateReleaseRequest request) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Owner not found"
                ));

        Pack pack = packRepository.findById(request.packId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Pack not found"
                ));

        if (!pack.getOwner().getId().equals(ownerId)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Pack does not belong to owner"
            );
        }

        ReleaseStatus status = request.status() != null
                ? request.status()
                : ReleaseStatus.PLANNED;

        Release release = Release.builder()
                .owner(owner)
                .pack(pack)
                .title(request.title())
                .releaseDateTime(request.releaseDateTime())
                .status(status)
                .notes(request.notes())
                .build();

        return releaseRepository.save(release);
    }

    public Release updateRelease(Long ownerId, Long releaseId, UpdateReleaseRequest request) {
        Release release = getReleaseForOwner(releaseId, ownerId);

        if (request.packId() != null) {
            Pack pack = packRepository.findById(request.packId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.BAD_REQUEST, "Pack not found"
                    ));

            if (!pack.getOwner().getId().equals(ownerId)) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Pack does not belong to owner"
                );
            }

            release.setPack(pack);
        }

        if (request.title() != null && !request.title().isBlank()) {
            release.setTitle(request.title());
        }

        if (request.releaseDateTime() != null) {
            release.setReleaseDateTime(request.releaseDateTime());
        }

        if (request.status() != null) {
            release.setStatus(request.status());
        }

        if (request.notes() != null) {
            release.setNotes(request.notes());
        }

        return releaseRepository.save(release);
    }

    public void deleteRelease(Long ownerId, Long releaseId) {
        Release release = getReleaseForOwner(releaseId, ownerId);
        releaseRepository.delete(release);
    }

    // ------------------------------------------------------------------------
    // Platforms
    // ------------------------------------------------------------------------

    @Transactional(readOnly = true)
    public List<ReleasePlatform> getPlatformsForRelease(Long ownerId, Long releaseId) {
        Release release = getReleaseForOwner(releaseId, ownerId);
        // platforms уже загружаются как коллекция (LAZY, но мы внутри транзакции)
        return release.getPlatforms();
    }

    public ReleasePlatform upsertPlatformForRelease(
            Long ownerId,
            Long releaseId,
            Platform platform,
            UpdateReleasePlatformRequest request
    ) {
        Release release = getReleaseForOwner(releaseId, ownerId);

        ReleasePlatform entity = releasePlatformRepository
                .findByReleaseIdAndPlatform(releaseId, platform)
                .orElseGet(() -> ReleasePlatform.builder()
                        .release(release)
                        .platform(platform)
                        .status(request.status() != null
                                ? request.status()
                                : ReleasePlatformStatus.PLANNED)
                        .build()
                );

        if (request.status() != null) {
            entity.setStatus(request.status());
        }
        if (request.plannedDateTime() != null) {
            entity.setPlannedDateTime(request.plannedDateTime());
        }
        if (request.publishedDateTime() != null) {
            entity.setPublishedDateTime(request.publishedDateTime());
        }
        if (request.notes() != null) {
            entity.setNotes(request.notes());
        }

        return releasePlatformRepository.save(entity);
    }

    // ------------------------------------------------------------------------
    // Post drafts
    // ------------------------------------------------------------------------

    @Transactional(readOnly = true)
    public PostDraft getPostDraftForPlatform(Long ownerId, Long releasePlatformId) {
        ReleasePlatform platform = getPlatformForOwner(ownerId, releasePlatformId);

        return postDraftRepository.findByReleasePlatformId(platform.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Post draft not found"
                ));
    }

    public PostDraft upsertPostDraft(
            Long ownerId,
            Long releasePlatformId,
            UpsertPostDraftRequest request
    ) {
        ReleasePlatform platform = getPlatformForOwner(ownerId, releasePlatformId);

        PostDraft draft = postDraftRepository.findByReleasePlatformId(releasePlatformId)
                .orElseGet(() -> PostDraft.builder()
                        .releasePlatform(platform)
                        .build()
                );

        if (request.title() != null) {
            draft.setTitle(request.title());
        }
        if (request.body() != null) {
            draft.setBody(request.body());
        }
        if (request.hashtags() != null) {
            draft.setHashtags(request.hashtags());
        }
        if (request.language() != null) {
            draft.setLanguage(request.language());
        }

        return postDraftRepository.save(draft);
    }

    // ------------------------------------------------------------------------
    // helpers
    // ------------------------------------------------------------------------

    @Transactional(readOnly = true)
    protected ReleasePlatform getPlatformForOwner(Long ownerId, Long releasePlatformId) {
        ReleasePlatform platform = releasePlatformRepository.findById(releasePlatformId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Release platform not found"
                ));

        if (!platform.getRelease().getOwner().getId().equals(ownerId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Release platform not found"
            );
        }

        return platform;
    }
}
