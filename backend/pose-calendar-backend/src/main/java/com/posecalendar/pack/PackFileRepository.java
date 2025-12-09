package com.posecalendar.pack;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PackFileRepository extends JpaRepository<PackFile, UUID> {

    /**
     * Получить все файлы пака, отсортированные по дате создания.
     */
    List<PackFile> findByPackIdOrderByCreatedAtAsc(Long packId);
}
