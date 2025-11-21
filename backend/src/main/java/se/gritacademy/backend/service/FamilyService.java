package se.gritacademy.backend.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import se.gritacademy.backend.dto.family.CreateFamilyRequestDto;
import se.gritacademy.backend.dto.family.FamilyDto;
import se.gritacademy.backend.entity.family.Family;
import se.gritacademy.backend.entity.user.Parent;
import se.gritacademy.backend.entity.user.User;
import se.gritacademy.backend.mapper.FamilyMapper;
import se.gritacademy.backend.repository.FamilyRepository;
import se.gritacademy.backend.repository.UserRepository;

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
    public FamilyDto getFamily(Long familyId, Parent actor) {
        Family family = getFamilyOrThrow(familyId);
        verifyFamilyMember(family, actor);

        return familyMapper.toFamilyDto(family);
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
     * Verify that a parent is a member of the family.
     * Throws 403 if not a member.
     */
    private void verifyFamilyMember(Family family, Parent parent) {
        boolean isMember = family.getMembers().stream()
                .anyMatch(member -> member.getId().equals(parent.getId()));
        if (!isMember) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Parent must belong to the family");
        }
    }

    /**
     * HELPER: Save family and map to DTO
     */
    private FamilyDto saveAndMap(Family family) {
        family = familyRepository.save(family);
        return familyMapper.toFamilyDto(family);
    }
}