package se.gritacademy.backend.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import se.gritacademy.backend.dto.family.FamilyDto;
import se.gritacademy.backend.dto.user.RegisterUserRequestDto;
import se.gritacademy.backend.dto.user.UpdateUserRequestDto;
import se.gritacademy.backend.dto.user.UserDto;
import se.gritacademy.backend.entity.user.User;
import se.gritacademy.backend.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserDto register(@Valid @RequestBody RegisterUserRequestDto registerUserRequestDto) {
        return userService.registerUser(registerUserRequestDto);
    }

    @GetMapping("/{userId}")
    @ResponseStatus(HttpStatus.OK)
    public UserDto getUser(@PathVariable Long userId) {
        return userService.getUser(userId);
    }

    @PatchMapping("/{userId}")
    @ResponseStatus(HttpStatus.OK)
    public UserDto updateUser(@PathVariable Long userId,
                              @Valid @RequestBody UpdateUserRequestDto request,
                              @AuthenticationPrincipal User actor) {
        return userService.updateUser(userId, request, actor);
    }

    @DeleteMapping("/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable Long userId,
                           @AuthenticationPrincipal User actor) {
        userService.deleteUser(userId, actor);
    }

    @GetMapping("/{userId}/families")
    @ResponseStatus(HttpStatus.OK)
    public List<FamilyDto> getUserFamilies(@PathVariable Long userId,
                                           @AuthenticationPrincipal User actor) {
        return userService.getUserFamilies(userId, actor);
    }
}