package se.gritacademy.backend.service;

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
import se.gritacademy.backend.mapper.FamilyMapper;
import se.gritacademy.backend.repository.FamilyRepository;
import se.gritacademy.backend.repository.UserRepository;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class FamilyService {

    private final FamilyRepository familyRepository;
    private final UserRepository userRepository;
    private final FamilyMapper familyMapper;

    public FamilyService(FamilyRepository familyRepository,
                         UserRepository userRepository,
                         FamilyMapper familyMapper) {
        this.familyRepository = familyRepository;
        this.userRepository = userRepository;
        this.familyMapper = familyMapper;
    }

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
        Family family = getFamilyOrThrow(familyId);
        verifyFamilyMember(family, actor);

        User user = getUserOrThrow(userId);
        family.getMembers().add(user);
        return saveAndMap(family);
    }

    /**
     * Remove an existing user from a family.
     */
    public FamilyDto removeMember(Long familyId, Long userId, Parent actor) {
        Family family = getFamilyOrThrow(familyId);
        verifyFamilyMember(family, actor);
        User user = getUserOrThrow(userId);

        if (user instanceof Child child) {
            Set<Chore> choresToRemove = getChoresToRemove(child, familyId);
            removeChoresFromChildAndFamily(choresToRemove, child, family);
        }

        if (!family.getMembers().remove(user)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User is not a member of this family");
        }
        return saveAndMap(family);
    }

    /**
     * Update the name of an existing family.
     */
    public FamilyDto updateFamilyName(Long familyId, String newName, Parent actor) {
        Family family = getFamilyOrThrow(familyId);
        verifyFamilyMember(family, actor);

        family.setFamilyName(newName);
        return saveAndMap(family);
    }

    /**
     * Delete a family by its ID.
     */
    public void deleteFamily(Long familyId, Parent actor) {
        Family family = getFamilyOrThrow(familyId);
        verifyFamilyMember(family, actor);

        familyRepository.delete(family);
    }

    /**
     * Get a family by ID, including all members.
     */
    public FamilyDto getFamily(Long familyId, User actor) {
        Family family = getFamilyOrThrow(familyId);
        verifyFamilyMember(family, actor);

        return familyMapper.toFamilyDto(family);
    }

    /**
     * Verify that a user is a member of the family.
     * Throws 403 if not a member.
     */
    public void verifyFamilyMember(Family family, User user) {
        boolean isMember = family.getMembers().stream()
                .anyMatch(member -> member.getId().equals(user.getId()));
        if (!isMember) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User must belong to the family");
        }
    }

    /**
     * HELPER: Fetch family or throw 404
     */
    private Family getFamilyOrThrow(Long familyId) {
        return familyRepository.findById(familyId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Family not found"));
    }

    /**
     * HELPER: Fetch user or throw 404
     */
    private User getUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    /**
     * HELPER: Save family and map to DTO
     */
    private FamilyDto saveAndMap(Family family) {
        family = familyRepository.save(family);
        return familyMapper.toFamilyDto(family);
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