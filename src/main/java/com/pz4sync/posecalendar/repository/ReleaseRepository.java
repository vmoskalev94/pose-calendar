package com.pz4sync.posecalendar.repository;

import com.pz4sync.posecalendar.domain.Release;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReleaseRepository extends JpaRepository<Release, Long> {

    List<Release> findByPackIdOrderByReleaseDateTimeAsc(Long packId);

    List<Release> findByReleaseDateTimeBetweenOrderByReleaseDateTimeAsc(
            LocalDateTime from,
            LocalDateTime to
    );
}
