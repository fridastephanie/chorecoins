package se.gritacademy.backend.helper;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import se.gritacademy.backend.entity.family.Family;
import se.gritacademy.backend.entity.user.User;
import se.gritacademy.backend.repository.FamilyRepository;

@Component
@RequiredArgsConstructor
public class FamilyHelper {

    private final FamilyRepository familyRepository;

    public Family getFamilyOrThrow(Long familyId) {
        return familyRepository.findById(familyId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Family not found"));
    }

    public void verifyFamilyMember(Family family, User user) {
        boolean isMember = family.getMembers().stream()
                .anyMatch(member -> member.getId().equals(user.getId()));
        if (!isMember) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User must belong to the family");
    }
}
