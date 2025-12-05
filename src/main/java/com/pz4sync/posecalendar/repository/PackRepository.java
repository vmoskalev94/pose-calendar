package com.pz4sync.posecalendar.repository;

import com.pz4sync.posecalendar.domain.Pack;
import com.pz4sync.posecalendar.domain.PackStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PackRepository extends JpaRepository<Pack, Long> {

    List<Pack> findAllByStatusOrderByCreatedAtDesc(PackStatus status);
}
