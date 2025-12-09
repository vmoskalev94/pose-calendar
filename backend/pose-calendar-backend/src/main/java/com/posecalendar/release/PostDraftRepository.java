package com.posecalendar.release;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PostDraftRepository extends JpaRepository<PostDraft, Long> {

    /**
     * Черновик по конкретной платформе релиза.
     */
    Optional<PostDraft> findByReleasePlatformId(Long releasePlatformId);
}
