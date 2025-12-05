package se.gritacademy.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import se.gritacademy.backend.dto.family.CreateFamilyRequestDto;
import se.gritacademy.backend.dto.family.FamilyDto;
import se.gritacademy.backend.entity.chore.Chore;
import se.gritacademy.backend.entity.family.Family;
import se.gritacademy.backend.entity.user.Child;
import se.gritacademy.backend.entity.user.Parent;
import se.gritacademy.backend.entity.user.User;
import se.gritacademy.backend.helper.FamilyHelper;
import se.gritacademy.backend.helper.UserHelper;
import se.gritacademy.backend.mapper.FamilyMapper;
import se.gritacademy.backend.repository.FamilyRepository;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FamilyService {

    private final UserHelper userHelper;
    private final FamilyHelper familyHelper;
    private final FamilyRepository familyRepository;
    private final FamilyMapper familyMapper;

    /**
     * Create a new family and add the creator as a member.
     */
    public FamilyDto createFamily(CreateFamilyRequestDto request, Parent creator) {
        Family family = new Family();
        family.setFamilyName(request.getFamilyName());
        family.getMembers().add(creator);
        return saveAndMap(family);
    }

    /**
     * Add an existing user to a family.
     */
    public FamilyDto addMember(Long familyId, Long userId, Parent actor) {
        Family family = familyHelper.getFamilyOrThrow(familyId);
        familyHelper.verifyFamilyMember(family, actor);
        User user = userHelper.getUserOrThrow(userId);
        family.getMembers().add(user);
        return saveAndMap(family);
    }

    /**
     * Remove an existing user from a family.
     */
    public FamilyDto removeMember(Long familyId, Long userId, Parent actor) {
        Family family = familyHelper.getFamilyOrThrow(familyId);
        familyHelper.verifyFamilyMember(family, actor);
        User user = userHelper.getUserOrThrow(userId);
        if (user instanceof Child child) {
            removeChildChoresFromFamily(child, family);
        }
        return removeUserFromFamilyAndSave(user, family);
    }

    /**
     * Update the name of an existing family.
     */
    public FamilyDto updateFamilyName(Long familyId, String newName, Parent actor) {
        Family family = familyHelper.getFamilyOrThrow(familyId);
        familyHelper.verifyFamilyMember(family, actor);
        family.setFamilyName(newName);
        return saveAndMap(family);
    }

    /**
     * Delete a family by its ID.
     */
    public void deleteFamily(Long familyId, Parent actor) {
        Family family = familyHelper.getFamilyOrThrow(familyId);
        familyHelper.verifyFamilyMember(family, actor);
        familyRepository.delete(family);
    }

    /**
     * Get a family by ID, including all members.
     */
    public FamilyDto getFamily(Long familyId, User actor) {
        Family family = familyHelper.getFamilyOrThrow(familyId);
        familyHelper.verifyFamilyMember(family, actor);
        return familyMapper.toFamilyDto(family);
    }

    // ----------------- PRIVATE HELPERS -----------------

    /**
     * HELPER: Save family and map to DTO
     */
    private FamilyDto saveAndMap(Family family) {
        family = familyRepository.save(family);
        return familyMapper.toFamilyDto(family);
    }

    /**
     * HELPER: Remove all chores of a child from a family.
     */
    private void removeChildChoresFromFamily(Child child, Family family) {
        Set<Chore> choresToRemove = getChoresToRemove(child, family.getId());
        removeChoresFromChildAndFamily(choresToRemove, child, family);
    }

    /**
     * HELPER: Remove a user from the family and save.
     */
    private FamilyDto removeUserFromFamilyAndSave(User user, Family family) {
        if (!family.getMembers().remove(user)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User is not a member of this family");
        }
        return saveAndMap(family);
    }

    /**
     * HELPER: Get all chores assigned to a child in a specific family.
     */
    private Set<Chore> getChoresToRemove(Child child, Long familyId) {
        return child.getChores().stream()
                .filter(chore -> chore.getFamily().getId().equals(familyId))
                .collect(Collectors.toSet());
    }

    /**
     * HELPER: Remove chores from child and family.
     */
    private void removeChoresFromChildAndFamily(Set<Chore> chores, Child child, Family family) {
        chores.forEach(chore -> {
            child.getChores().remove(chore);
            family.getChores().remove(chore);
        });
    }
}