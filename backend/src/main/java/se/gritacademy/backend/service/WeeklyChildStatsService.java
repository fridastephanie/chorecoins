package se.gritacademy.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import se.gritacademy.backend.dto.weeklychildstats.*;
import se.gritacademy.backend.entity.family.Family;
import se.gritacademy.backend.entity.user.Child;
import se.gritacademy.backend.entity.user.User;
import se.gritacademy.backend.entity.weeklychildstats.WeeklyChildStats;
import se.gritacademy.backend.helper.FamilyHelper;
import se.gritacademy.backend.helper.UserHelper;
import se.gritacademy.backend.helper.WeeklyChildStatsHelper;
import se.gritacademy.backend.mapper.WeeklyChildStatsMapper;
import se.gritacademy.backend.repository.WeeklyChildStatsRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WeeklyChildStatsService {

    private final UserHelper userHelper;
    private final FamilyHelper familyHelper;
    private final WeeklyChildStatsHelper weeklyChildStatsHelper;
    private final WeeklyChildStatsRepository weeklyChildStatsRepository;
    private final WeeklyChildStatsMapper mapper;

    /**
     * Creates weekly stats for a child/family for the scheduler.
     * Does not require a logged-in user. Throws 400 if stats already exist.
     */
    @Transactional
    public void createWeeklyStatsSystem(CreateWeeklyChildStatsRequestDto dto) {
        Child child = getChildOrThrow(dto.getChildId());
        Family family = familyHelper.getFamilyOrThrow(dto.getFamilyId());
        WeeklyChildStats stats = weeklyChildStatsHelper.getOrCreateCurrentWeekStats(child, family);
        stats.setCompletedChoresCount(dto.getCompletedChoresCount());
        stats.setEarnedCoins(dto.getEarnedCoins());
        weeklyChildStatsRepository.save(stats);
    }

    /**
     * Create weekly stats for a child/family. Throws 400 if stats already exist.
     */
    @Transactional
    public WeeklyChildStatsDto createWeeklyStats(CreateWeeklyChildStatsRequestDto dto, User currentUser) {
        Child child = getChildOrThrow(dto.getChildId());
        Family family = familyHelper.getFamilyOrThrow(dto.getFamilyId());
        verifyAccessForChildOrParent(child.getId(), family, currentUser);
        WeeklyChildStats stats = weeklyChildStatsHelper.getOrCreateCurrentWeekStats(child, family);
        stats.setCompletedChoresCount(dto.getCompletedChoresCount());
        stats.setEarnedCoins(dto.getEarnedCoins());
        return mapper.toDto(weeklyChildStatsRepository.save(stats));
    }

    /**
     * Update existing weekly stats. Throws 404 if stats not found.
     */
    @Transactional
    public WeeklyChildStatsDto updateWeeklyStats(Long id, UpdateWeeklyChildStatsRequestDto dto, User currentUser) {
        WeeklyChildStats stats = findStatsOrThrow(id);
        verifyAccessForChildOrParent(stats.getChild().getId(), stats.getFamily(), currentUser);
        updateStatsFromDto(stats, dto);
        return mapper.toDto(weeklyChildStatsRepository.save(stats));
    }

    /**
     * Get weekly stats by ID. Throws 404 if not found, 403 if no access.
     */
    public WeeklyChildStatsDto getStats(Long id, User currentUser) {
        WeeklyChildStats stats = findStatsOrThrow(id);
        verifyAccessForChildOrParent(stats.getChild().getId(), stats.getFamily(), currentUser);
        return mapper.toDto(stats);
    }

    /**
     * Get all weekly stats for a child. Throws 404 if child not found, 403 if not a child.
     */
    public List<WeeklyChildStatsDto> getStatsForChild(Long childId, User currentUser) {
        Child child = getChildOrThrow(childId);
        return weeklyChildStatsRepository.findByChildId(child.getId())
                .stream()
                .filter(stats -> {
                    try {
                        verifyAccessForChildOrParent(child.getId(), stats.getFamily(), currentUser);
                        return true;
                    } catch (ResponseStatusException e) {
                        return false;
                    }
                })
                .map(mapper::toDto)
                .toList();
    }

    /**
     * Get stats for a child for a specific week/year **and family**.
     * Throws 404 if not found, 403 if no access.
     */
    public WeeklyChildStatsDto getStatsForChildWeekAndFamily(
            Long childId,
            Long familyId,
            int weekNumber,
            int year,
            User currentUser) {
        WeeklyChildStats stats = findStatsForChildWeekAndFamilyOrThrow(childId, familyId, weekNumber, year);
        verifyAccessForChildOrParent(childId, stats.getFamily(), currentUser);
        return mapper.toDto(stats);
    }

    /**
     * Check if weekly stats exist for a child/family/week/year.
     */
    public boolean existsByChildAndFamilyAndWeekAndYear(Long childId, Long familyId, int weekNumber, int year) {
        return weeklyChildStatsRepository
                .findByChildIdAndFamilyIdAndWeekNumberAndYear(childId, familyId, weekNumber, year)
                .isPresent();
    }

    // ----------------- PRIVATE HELPERS -----------------

    /**
     * HELPER: Fetch Child by ID using UserHelper. Throws 404 if not found, 403 if not a Child.
     */
    private Child getChildOrThrow(Long childId) {
        User user = userHelper.getUserOrThrow(childId);
        return userHelper.ensureChild(user);
    }

    /**
     * HELPER: Verify access for CHILD/PARENT. Throws 403 if not allowed.
     */
    private void verifyAccessForChildOrParent(Long childId, Family family, User currentUser) {
        if (currentUser.getRole().equals("CHILD") && !currentUser.getId().equals(childId))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Children can only access their own stats");
        if (currentUser.getRole().equals("PARENT")) familyHelper.verifyFamilyMember(family, currentUser);
    }

    /**
     * HELPER: Fetch WeeklyChildStats by ID. Throws 404 if not found.
     */
    private WeeklyChildStats findStatsOrThrow(Long id) {
        return weeklyChildStatsRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Weekly stats not found"));
    }

    /**
     * HELPER: Fetch WeeklyChildStats by child, family, week and year.
     * Throws 404 if not found.
     */
    private WeeklyChildStats findStatsForChildWeekAndFamilyOrThrow(
            Long childId,
            Long familyId,
            int weekNumber,
            int year) {
        return weeklyChildStatsRepository
                .findByChildIdAndFamilyIdAndWeekNumberAndYear(childId, familyId, weekNumber, year)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Stats not found for this child, family, week and year"));
    }

    /**
     * HELPER: Update existing stats from DTO.
     */
    private void updateStatsFromDto(WeeklyChildStats stats, UpdateWeeklyChildStatsRequestDto dto) {
        if (dto.getCompletedChoresCount() != null) stats.setCompletedChoresCount(dto.getCompletedChoresCount());
        if (dto.getEarnedCoins() != null) stats.setEarnedCoins(dto.getEarnedCoins());
    }
}