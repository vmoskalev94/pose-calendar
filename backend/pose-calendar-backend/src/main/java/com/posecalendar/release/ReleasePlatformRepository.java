package com.posecalendar.release;

import com.posecalendar.platform.Platform;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReleasePlatformRepository extends JpaRepository<ReleasePlatform, Long> {

    /**
     * Все платформы по конкретному релизу.
     */
    List<ReleasePlatform> findAllByReleaseId(Long releaseId);

    /**
     * Платформа релиза по комбинации release + platform (уникальная пара).
     */
    Optional<ReleasePlatform> findByReleaseIdAndPlatform(Long releaseId, Platform platform);
}
