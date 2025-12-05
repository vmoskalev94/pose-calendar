package com.pz4sync.posecalendar.service;

import com.pz4sync.posecalendar.domain.Pack;
import com.pz4sync.posecalendar.domain.Release;
import com.pz4sync.posecalendar.repository.PackRepository;
import com.pz4sync.posecalendar.repository.ReleaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReleaseService {

    private final ReleaseRepository releaseRepository;
    private final PackRepository packRepository;

    @Transactional
    public Release createRelease(
            Long packId,
            LocalDateTime releaseDateTime,
            boolean telegramPlanned,
            boolean vkPlanned,
            boolean boostyPlanned,
            boolean tumblrPlanned
    ) {
        Pack pack = packRepository.findById(packId)
                .orElseThrow(() -> new IllegalArgumentException("Pack not found: " + packId));

        Release release = Release.builder()
                .pack(pack)
                .releaseDateTime(releaseDateTime)
                .telegramPlanned(telegramPlanned)
                .vkPlanned(vkPlanned)
                .boostyPlanned(boostyPlanned)
                .tumblrPlanned(tumblrPlanned)
                .build();

        return releaseRepository.save(release);
    }

    @Transactional(readOnly = true)
    public List<Release> getReleasesForPack(Long packId) {
        return releaseRepository.findByPackIdOrderByReleaseDateTimeAsc(packId);
    }

    @Transactional(readOnly = true)
    public List<Release> findReleasesBetween(LocalDateTime from, LocalDateTime to) {
        return releaseRepository.findByReleaseDateTimeBetweenOrderByReleaseDateTimeAsc(from, to);
    }

    @Transactional
    public void deleteRelease(Long id) {
        releaseRepository.deleteById(id);
    }
}
