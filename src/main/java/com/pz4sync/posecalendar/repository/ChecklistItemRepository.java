package com.pz4sync.posecalendar.repository;

import com.pz4sync.posecalendar.domain.ChecklistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChecklistItemRepository extends JpaRepository<ChecklistItem, Long> {

    List<ChecklistItem> findByPackIdOrderByOrderIndexAsc(Long packId);
}
