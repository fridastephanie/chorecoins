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
import se.gritacademy.backend.mapper.WeeklyChildStatsMapper;
import se.gritacademy.backend.repository.FamilyRepository;
import se.gritacademy.backend.repository.UserRepository;
import se.gritacademy.backend.repository.WeeklyChildStatsRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WeeklyChildStatsService {

    private final WeeklyChildStatsRepository weeklyChildStatsRepository;
    private final UserRepository userRepository;
    private final FamilyRepository familyRepository;
    private final WeeklyChildStatsMapper mapper;
    private final FamilyService familyService;

    /**
     * Create weekly stats for a child/family. Throws 400 if stats already exist.
     */
    @Transactional
    public WeeklyChildStatsDto createWeeklyStats(CreateWeeklyChildStatsRequestDto dto) {
        Child child = getChildOrThrow(dto.getChildId());
        Family family = getFamilyOrThrow(dto.getFamilyId());
        ensureStatsNotExist(child.getId(), family.getId(), dto.getWeekNumber(), dto.getYear());
        WeeklyChildStats stats = buildWeeklyStats(child, family, dto);
        return mapper.toDto(weeklyChildStatsRepository.save(stats));
    }

    /**
     * Update existing weekly stats. Throws 404 if stats not found.
     */
    @Transactional
    public WeeklyChildStatsDto updateWeeklyStats(Long id, UpdateWeeklyChildStatsRequestDto dto) {
        WeeklyChildStats stats = findStatsOrThrow(id);
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
     * Get all weekly stats for a child. Throws 404 if child not found.
     */
    public List<WeeklyChildStatsDto> getStatsForChild(Long childId, User currentUser) {
        verifyChildExists(childId);
        return weeklyChildStatsRepository.findByChildId(childId)
                .stream()
                .filter(stats -> {
                    try {
                        verifyAccessForChildOrParent(childId, stats.getFamily(), currentUser);
                        return true;
                    } catch (ResponseStatusException e) {
                        return false;
                    }
                })
                .map(mapper::toDto)
                .toList();
    }

    /**
     * Get stats for a child for a specific week/year. Throws 404 if not found, 403 if no access.
     */
    public WeeklyChildStatsDto getStatsForChildWeek(Long childId, int weekNumber, int year, User currentUser) {
        WeeklyChildStats stats = weeklyChildStatsRepository
                .findByChildIdAndWeekNumberAndYear(childId, weekNumber, year)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Stats not found"));
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

    /**
     * HELPER: Fetch WeeklyChildStats by ID. Throws 404 if not found.
     */
    private WeeklyChildStats findStatsOrThrow(Long id) {
        return weeklyChildStatsRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Weekly stats not found"));
    }

    /**
     * HELPER: Ensure stats do not exist for child/family/week/year. Throws 400 if exists.
     */
    private void ensureStatsNotExist(Long childId, Long familyId, int weekNumber, int year) {
        weeklyChildStatsRepository.findByChildIdAndFamilyIdAndWeekNumberAndYear(childId, familyId, weekNumber, year)
                .ifPresent(existing -> {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Weekly stats for this child, family and week already exist");
                });
    }

    /**
     * HELPER: Build WeeklyChildStats from DTO.
     */
    private WeeklyChildStats buildWeeklyStats(Child child, Family family, CreateWeeklyChildStatsRequestDto dto) {
        WeeklyChildStats stats = new WeeklyChildStats();
        stats.setChild(child);
        stats.setFamily(family);
        stats.setWeekNumber(dto.getWeekNumber());
        stats.setYear(dto.getYear());
        stats.setCompletedChoresCount(dto.getCompletedChoresCount());
        stats.setEarnedCoins(dto.getEarnedCoins());
        return stats;
    }

    /**
     * HELPER: Update existing stats from DTO.
     */
    private void updateStatsFromDto(WeeklyChildStats stats, UpdateWeeklyChildStatsRequestDto dto) {
        if (dto.getCompletedChoresCount() != null) stats.setCompletedChoresCount(dto.getCompletedChoresCount());
        if (dto.getEarnedCoins() != null) stats.setEarnedCoins(dto.getEarnedCoins());
    }

    /**
     * HELPER: Fetch Child by ID. Throws 404 if not found, 400 if not a Child.
     */
    private Child getChildOrThrow(Long childId) {
        User user = userRepository.findById(childId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Child not found"));
        if (!(user instanceof Child child)) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User is not a child");
        return child;
    }

    /**
     * HELPER: Fetch Family by ID. Throws 404 if not found.
     */
    private Family getFamilyOrThrow(Long familyId) {
        return familyRepository.findById(familyId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Family not found"));
    }

    /**
     * HELPER: Verify that a child exists. Throws 404 if not found.
     */
    private void verifyChildExists(Long childId) {
        if (!userRepository.existsById(childId)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Child not found");
    }

    /**
     * HELPER: Verify access for CHILD/PARENT. Throws 403 if not allowed.
     */
    private void verifyAccessForChildOrParent(Long childId, Family family, User currentUser) {
        if (currentUser.getRole().equals("CHILD") && !currentUser.getId().equals(childId))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Children can only access their own stats");
        if (currentUser.getRole().equals("PARENT")) familyService.verifyFamilyMember(family, currentUser);
    }
}