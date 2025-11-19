package se.gritacademy.backend.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import se.gritacademy.backend.dto.family.AddFamilyMemberRequestDto;
import se.gritacademy.backend.dto.family.CreateFamilyRequestDto;
import se.gritacademy.backend.dto.family.FamilyDto;
import se.gritacademy.backend.entity.user.Parent;
import se.gritacademy.backend.service.FamilyService;

@RestController
@RequestMapping("/api/families")
public class FamilyController {

    private final FamilyService familyService;

    public FamilyController(FamilyService familyService) {
        this.familyService = familyService;
    }

    @PostMapping
    @PreAuthorize("hasRole('PARENT')")
    @ResponseStatus(HttpStatus.CREATED)
    public FamilyDto createFamily(@Valid @RequestBody CreateFamilyRequestDto request,
                                  @AuthenticationPrincipal Parent creator) {
        return familyService.createFamily(request, creator);
    }

    @PostMapping("/{familyId}/members")
    @PreAuthorize("hasRole('PARENT')")
    @ResponseStatus(HttpStatus.OK)
    public FamilyDto addMember(@PathVariable Long familyId,
                               @RequestBody AddFamilyMemberRequestDto request) {
        return familyService.addMember(familyId, request.getUserId());
    }

    @GetMapping("/{familyId}")
    @ResponseStatus(HttpStatus.OK)
    public FamilyDto getFamily(@PathVariable Long familyId) {
        return familyService.getFamily(familyId);
    }
}