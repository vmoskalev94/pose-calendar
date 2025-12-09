package com.posecalendar.release.api;

import com.posecalendar.release.PostDraft;
import com.posecalendar.release.Release;
import com.posecalendar.release.ReleasePlatform;
import lombok.experimental.UtilityClass;

import java.util.List;

@UtilityClass
public class ReleaseMapper {

    public ReleaseDto toDto(Release release) {
        List<ReleasePlatformDto> platformDtos = release.getPlatforms()
                .stream()
                .map(ReleaseMapper::toDto)
                .toList();

        return new ReleaseDto(
                release.getId(),
                release.getPack().getId(),
                release.getPack().getTitleRu(), //todo или getName(), если у тебя другое поле
                release.getTitle(),
                release.getReleaseDateTime(),
                release.getStatus(),
                release.getNotes(),
                platformDtos
        );
    }

    public ReleasePlatformDto toDto(ReleasePlatform platform) {
        PostDraftDto postDraftDto = null;
        PostDraft postDraft = platform.getPostDraft();
        if (postDraft != null) {
            postDraftDto = toDto(postDraft);
        }

        return new ReleasePlatformDto(
                platform.getId(),
                platform.getPlatform(),
                platform.getStatus(),
                platform.getPlannedDateTime(),
                platform.getPublishedDateTime(),
                platform.getNotes(),
                postDraftDto
        );
    }

    public PostDraftDto toDto(PostDraft draft) {
        return new PostDraftDto(
                draft.getId(),
                draft.getTitle(),
                draft.getBody(),
                draft.getHashtags(),
                draft.getLanguage()
        );
    }
}
