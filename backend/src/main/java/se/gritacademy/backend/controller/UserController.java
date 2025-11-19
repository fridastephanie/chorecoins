package se.gritacademy.backend.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import se.gritacademy.backend.dto.user.RegisterRequestDto;
import se.gritacademy.backend.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void register(@Valid @RequestBody RegisterRequestDto registerRequestDto) {
        userService.registerUser(registerRequestDto);
    }
}