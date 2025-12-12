// src/main/java/com/posecalendar/pack/PackRepository.java
package com.posecalendar.pack;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface PackRepository extends JpaRepository<Pack, Long> {

    List<Pack> findAllByOwnerIdOrderByCreatedAtDesc(Long ownerId);

    List<Pack> findAllByOwnerIdAndStatusInOrderByCreatedAtDesc(
            Long ownerId,
            List<PackStatus> statuses
    );

    List<Pack> findAllByOwnerIdAndPlannedReleaseAtBetween(
            Long ownerId,
            LocalDateTime from,
            LocalDateTime to
    );

    List<Pack> findAllByOwnerIdAndPlannedReleaseAtBetweenOrderByPlannedReleaseAtAsc(
            Long ownerId,
            LocalDateTime from,
            LocalDateTime to
    );

}
