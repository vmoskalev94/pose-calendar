package com.pz4sync.posecalendar.service;

import com.pz4sync.posecalendar.domain.ChecklistItem;
import com.pz4sync.posecalendar.domain.Pack;
import com.pz4sync.posecalendar.domain.PackStatus;
import com.pz4sync.posecalendar.repository.ChecklistItemRepository;
import com.pz4sync.posecalendar.repository.PackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PackService {

    private final PackRepository packRepository;
    private final ChecklistItemRepository checklistItemRepository;

    // Базовый чек-лист, который будет создаваться для каждого нового пака
    private static final List<String> DEFAULT_CHECKLIST_TITLES = List.of(
            "Сделать позы",
            "Протестировать позы в игре",
            "Сделать скрины",
            "Сделать обложку",
            "Подготовить текст поста",
            "Собрать .package / архив",
            "Подготовить пост для Telegram",
            "Подготовить пост для VK",
            "Подготовить пост для Boosty",
            "Подготовить пост для Tumblr"
    );

    @Transactional
    public Pack createPack(Pack pack) {
        Instant now = Instant.now();
        pack.setCreatedAt(now);
        pack.setUpdatedAt(now);

        if (pack.getStatus() == null) {
            pack.setStatus(PackStatus.IDEA);
        }

        Pack saved = packRepository.save(pack);
        createDefaultChecklistForPack(saved);
        return saved;
    }

    @Transactional
    public Pack updatePack(Pack pack) {
        pack.setUpdatedAt(Instant.now());
        return packRepository.save(pack);
    }

    @Transactional(readOnly = true)
    public Pack getPackOrThrow(Long id) {
        return packRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Pack not found: " + id));
    }

    @Transactional(readOnly = true)
    public List<Pack> findAll() {
        return packRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Pack> findByStatus(PackStatus status) {
        return packRepository.findAllByStatusOrderByCreatedAtDesc(status);
    }

    @Transactional
    public void deletePack(Long id) {
        packRepository.deleteById(id);
        // Благодаря ON DELETE CASCADE в миграциях, релизы и чек-лист удалятся автоматически
    }

    private void createDefaultChecklistForPack(Pack pack) {
        int index = 0;
        for (String title : DEFAULT_CHECKLIST_TITLES) {
            ChecklistItem item = ChecklistItem.builder()
                    .pack(pack)
                    .title(title)
                    .done(false)
                    .orderIndex(index++)
                    .build();
            checklistItemRepository.save(item);
        }
    }
}
