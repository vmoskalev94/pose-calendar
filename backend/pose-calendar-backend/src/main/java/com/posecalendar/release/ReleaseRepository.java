package com.posecalendar.release;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ReleaseRepository extends JpaRepository<Release, Long> {

    /**
     * Выборка релизов конкретного пользователя в диапазоне дат
     * (для календаря: month view и т.п.).
     */
    List<Release> findAllByOwnerIdAndReleaseDateTimeBetweenOrderByReleaseDateTimeAsc(
            Long ownerId,
            LocalDateTime fromDateTime,
            LocalDateTime toDateTime
    );
}
