package se.gritacademy.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import se.gritacademy.backend.dto.weeklychildstats.*;
import se.gritacademy.backend.entity.user.User;
import se.gritacademy.backend.service.WeeklyChildStatsService;

import java.util.List;

@RestController
@RequestMapping("/api/weekly-stats")
@RequiredArgsConstructor
public class WeeklyChildStatsController {

    private final WeeklyChildStatsService weeklyChildStatsService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public WeeklyChildStatsDto create(@RequestBody CreateWeeklyChildStatsRequestDto dto) {
        return weeklyChildStatsService.createWeeklyStats(dto);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public WeeklyChildStatsDto update(
            @PathVariable Long id,
            @RequestBody UpdateWeeklyChildStatsRequestDto dto) {
        return weeklyChildStatsService.updateWeeklyStats(id, dto);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public WeeklyChildStatsDto get(@PathVariable Long id,
                                   @AuthenticationPrincipal User currentUser) {
        return weeklyChildStatsService.getStats(id, currentUser);
    }

    @GetMapping("/child/{childId}")
    @ResponseStatus(HttpStatus.OK)
    public List<WeeklyChildStatsDto> getForChild(@PathVariable Long childId,
                                                 @AuthenticationPrincipal User currentUser) {
        return weeklyChildStatsService.getStatsForChild(childId, currentUser);
    }

    @GetMapping("/child/{childId}/week/{weekNumber}/year/{year}")
    @ResponseStatus(HttpStatus.OK)
    public WeeklyChildStatsDto getForChildWeek(
            @PathVariable Long childId,
            @PathVariable int weekNumber,
            @PathVariable int year,
            @AuthenticationPrincipal User currentUser
    ) {
        return weeklyChildStatsService.getStatsForChildWeek(childId, weekNumber, year, currentUser);
    }
}