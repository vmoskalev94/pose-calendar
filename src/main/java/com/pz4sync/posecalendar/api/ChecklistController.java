package com.pz4sync.posecalendar.api;

import com.pz4sync.posecalendar.api.dto.ChecklistAddItemRequest;
import com.pz4sync.posecalendar.api.dto.ChecklistItemDto;
import com.pz4sync.posecalendar.api.dto.ChecklistToggleDoneRequest;
import com.pz4sync.posecalendar.domain.ChecklistItem;
import com.pz4sync.posecalendar.service.ChecklistService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ChecklistController {

    private final ChecklistService checklistService;

    @GetMapping("/api/packs/{packId}/checklist")
    public List<ChecklistItemDto> getChecklist(@PathVariable Long packId) {
        List<ChecklistItem> items = checklistService.getChecklistForPack(packId);
        return items.stream().map(ChecklistController::toDto).toList();
    }

    @PostMapping("/api/packs/{packId}/checklist")
    public ChecklistItemDto addChecklistItem(@PathVariable Long packId,
                                             @RequestBody @Valid ChecklistAddItemRequest request) {
        ChecklistItem item = checklistService.addCustomItem(
                packId,
                request.title(),
                request.orderIndex()
        );
        return toDto(item);
    }

    @PatchMapping("/api/checklist-items/{id}")
    public ChecklistItemDto updateDone(@PathVariable Long id,
                                       @RequestBody @Valid ChecklistToggleDoneRequest request) {
        ChecklistItem updated = checklistService.setDone(id, request.done());
        return toDto(updated);
    }

    @DeleteMapping("/api/checklist-items/{id}")
    public void deleteChecklistItem(@PathVariable Long id) {
        checklistService.deleteChecklistItem(id);
    }

    private static ChecklistItemDto toDto(ChecklistItem item) {
        return new ChecklistItemDto(
                item.getId(),
                item.getPack().getId(),
                item.getTitle(),
                item.isDone(),
                item.getOrderIndex()
        );
    }
}
