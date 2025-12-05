package com.pz4sync.posecalendar.service;

import com.pz4sync.posecalendar.domain.ChecklistItem;
import com.pz4sync.posecalendar.domain.Pack;
import com.pz4sync.posecalendar.repository.ChecklistItemRepository;
import com.pz4sync.posecalendar.repository.PackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChecklistService {

    private final ChecklistItemRepository checklistItemRepository;
    private final PackRepository packRepository;

    @Transactional(readOnly = true)
    public List<ChecklistItem> getChecklistForPack(Long packId) {
        return checklistItemRepository.findByPackIdOrderByOrderIndexAsc(packId);
    }

    @Transactional
    public ChecklistItem setDone(Long checklistItemId, boolean done) {
        ChecklistItem item = checklistItemRepository.findById(checklistItemId)
                .orElseThrow(() -> new IllegalArgumentException("Checklist item not found: " + checklistItemId));

        item.setDone(done);
        return checklistItemRepository.save(item);
    }

    @Transactional
    public ChecklistItem addCustomItem(Long packId, String title, Integer orderIndex) {
        Pack pack = packRepository.findById(packId)
                .orElseThrow(() -> new IllegalArgumentException("Pack not found: " + packId));

        ChecklistItem item = ChecklistItem.builder()
                .pack(pack)
                .title(title)
                .done(false)
                .orderIndex(orderIndex)
                .build();

        return checklistItemRepository.save(item);
    }

    @Transactional
    public void deleteChecklistItem(Long checklistItemId) {
        checklistItemRepository.deleteById(checklistItemId);
    }
}
