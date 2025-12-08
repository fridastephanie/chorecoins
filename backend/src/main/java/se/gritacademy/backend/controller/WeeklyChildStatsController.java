package se.gritacademy.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import se.gritacademy.backend.dto.weeklychildstats.*;
import se.gritacademy.backend.entity.user.User;
import se.gritacademy.backend.service.shared.WeeklyChildStatsService;

import java.util.List;

@RestController
@RequestMapping("/api/weekly-stats")
@PreAuthorize("hasAnyRole('CHILD', 'PARENT')")
@RequiredArgsConstructor
public class WeeklyChildStatsController {

    private final WeeklyChildStatsService weeklyChildStatsService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public WeeklyChildStatsDto create(@RequestBody CreateWeeklyChildStatsRequestDto dto,
                                      @AuthenticationPrincipal User currentUser) {
        return weeklyChildStatsService.createWeeklyStats(dto, currentUser);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public WeeklyChildStatsDto update(@PathVariable Long id,
                                      @RequestBody UpdateWeeklyChildStatsRequestDto dto,
                                      @AuthenticationPrincipal User currentUser) {
        return weeklyChildStatsService.updateWeeklyStats(id, dto, currentUser);
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

    @GetMapping("/child/{childId}/week/{weekNumber}/year/{year}/family/{familyId}")
    public WeeklyChildStatsDto getForChildWeekAndFamily(
            @PathVariable Long childId,
            @PathVariable int weekNumber,
            @PathVariable int year,
            @PathVariable Long familyId,
            @AuthenticationPrincipal User currentUser) {
        return weeklyChildStatsService.getStatsForChildWeekAndFamily(childId, familyId, weekNumber, year, currentUser);
    }
}