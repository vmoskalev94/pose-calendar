package com.posecalendar.pack;

import com.posecalendar.platform.Platform;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * Репозиторий для платформ пака.
 */
public interface PackPlatformRepository extends JpaRepository<PackPlatform, Long> {

    /**
     * Все платформы для конкретного пака.
     */
    List<PackPlatform> findAllByPackId(Long packId);

    /**
     * Платформа пака по комбинации pack + platform (уникальная пара).
     */
    Optional<PackPlatform> findByPackIdAndPlatform(Long packId, Platform platform);
}
