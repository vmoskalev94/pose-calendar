package com.pz4sync.posecalendar.api;

import com.pz4sync.posecalendar.api.dto.CalendarEventDto;
import com.pz4sync.posecalendar.domain.Pack;
import com.pz4sync.posecalendar.domain.Release;
import com.pz4sync.posecalendar.repository.PackRepository;
import com.pz4sync.posecalendar.service.ReleaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CalendarController {

    private final ReleaseService releaseService;
    private final PackRepository packRepository;

    @GetMapping("/calendar")
    public List<CalendarEventDto> getCalendarEvents(
            @RequestParam("from")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime from,
            @RequestParam("to")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime to
    ) {
        List<Release> releases = releaseService.findReleasesBetween(from, to);

        return releases.stream()
                .map(release -> {
                    Pack pack = release.getPack();
                    return new CalendarEventDto(
                            release.getId(),
                            pack.getId(),
                            pack.getNameRu(),
                            pack.getNameEn(),
                            pack.getType(),
                            pack.getStatus(),
                            release.getReleaseDateTime(),
                            release.isTelegramPlanned(),
                            release.isVkPlanned(),
                            release.isBoostyPlanned(),
                            release.isTumblrPlanned()
                    );
                })
                .toList();
    }
}
