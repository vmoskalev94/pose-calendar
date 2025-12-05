package com.pz4sync.posecalendar.api;

import com.pz4sync.posecalendar.api.dto.PackCreateRequest;
import com.pz4sync.posecalendar.api.dto.PackDto;
import com.pz4sync.posecalendar.api.dto.PackUpdateRequest;
import com.pz4sync.posecalendar.domain.Pack;
import com.pz4sync.posecalendar.domain.PackStatus;
import com.pz4sync.posecalendar.service.PackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/packs")
@RequiredArgsConstructor
public class PackController {

    private final PackService packService;

    @GetMapping
    public List<PackDto> getPacks(@RequestParam(name = "status", required = false) PackStatus status) {
        List<Pack> packs = (status != null)
                ? packService.findByStatus(status)
                : packService.findAll();
        return packs.stream().map(PackController::toDto).toList();
    }

    @GetMapping("/{id}")
    public PackDto getPack(@PathVariable Long id) {
        Pack pack = packService.getPackOrThrow(id);
        return toDto(pack);
    }

    @PostMapping
    public PackDto createPack(@RequestBody @Valid PackCreateRequest request) {
        Pack pack = Pack.builder()
                .nameRu(request.nameRu())
                .nameEn(request.nameEn())
                .type(request.type())
                .posesCount(request.posesCount())
                .couplePosesCount(request.couplePosesCount())
                .tags(request.tags())
                .description(request.description())
                .sourceDir(request.sourceDir())
                .screensDir(request.screensDir())
                .coverFile(request.coverFile())
                .packageFile(request.packageFile())
                .build();

        Pack saved = packService.createPack(pack);
        return toDto(saved);
    }

    @PutMapping("/{id}")
    public PackDto updatePack(@PathVariable Long id,
                              @RequestBody @Valid PackUpdateRequest request) {
        Pack existing = packService.getPackOrThrow(id);

        existing.setNameRu(request.nameRu());
        existing.setNameEn(request.nameEn());
        existing.setType(request.type());
        existing.setStatus(request.status());
        existing.setPosesCount(request.posesCount());
        existing.setCouplePosesCount(request.couplePosesCount());
        existing.setTags(request.tags());
        existing.setDescription(request.description());
        existing.setSourceDir(request.sourceDir());
        existing.setScreensDir(request.screensDir());
        existing.setCoverFile(request.coverFile());
        existing.setPackageFile(request.packageFile());

        Pack updated = packService.updatePack(existing);
        return toDto(updated);
    }

    @DeleteMapping("/{id}")
    public void deletePack(@PathVariable Long id) {
        packService.deletePack(id);
    }

    private static PackDto toDto(Pack pack) {
        return new PackDto(
                pack.getId(),
                pack.getNameRu(),
                pack.getNameEn(),
                pack.getType(),
                pack.getStatus(),
                pack.getPosesCount(),
                pack.getCouplePosesCount(),
                pack.getTags(),
                pack.getDescription(),
                pack.getSourceDir(),
                pack.getScreensDir(),
                pack.getCoverFile(),
                pack.getPackageFile(),
                pack.getCreatedAt(),
                pack.getUpdatedAt()
        );
    }
}
