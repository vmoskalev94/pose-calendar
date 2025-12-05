package com.pz4sync.posecalendar.api;

import com.pz4sync.posecalendar.api.dto.ReleaseCreateRequest;
import com.pz4sync.posecalendar.api.dto.ReleaseDto;
import com.pz4sync.posecalendar.domain.Release;
import com.pz4sync.posecalendar.service.ReleaseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ReleaseController {

    private final ReleaseService releaseService;

    @GetMapping("/api/packs/{packId}/releases")
    public List<ReleaseDto> getReleasesForPack(@PathVariable Long packId) {
        List<Release> releases = releaseService.getReleasesForPack(packId);
        return releases.stream().map(ReleaseController::toDto).toList();
    }

    @PostMapping("/api/packs/{packId}/releases")
    public ReleaseDto createRelease(@PathVariable Long packId,
                                    @RequestBody @Valid ReleaseCreateRequest request) {
        Release release = releaseService.createRelease(
                packId,
                request.releaseDateTime(),
                request.telegramPlanned(),
                request.vkPlanned(),
                request.boostyPlanned(),
                request.tumblrPlanned()
        );
        return toDto(release);
    }

    @DeleteMapping("/api/releases/{id}")
    public void deleteRelease(@PathVariable Long id) {
        releaseService.deleteRelease(id);
    }

    private static ReleaseDto toDto(Release release) {
        return new ReleaseDto(
                release.getId(),
                release.getPack().getId(),
                release.getReleaseDateTime(),
                release.isTelegramPlanned(),
                release.isVkPlanned(),
                release.isBoostyPlanned(),
                release.isTumblrPlanned()
        );
    }
}
