package com.posecalendar.release.api;

import jakarta.validation.constraints.Size;

public record UpsertPostDraftRequest(
        @Size(max = 255)
        String title,

        String body,

        @Size(max = 2000)
        String hashtags,

        @Size(max = 32)
        String language
) {
}

