package com.posecalendar.pack;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PackTaskRepository extends JpaRepository<PackTask, Long> {

    List<PackTask> findAllByPackIdOrderByOrderIndexAsc(Long packId);
}
