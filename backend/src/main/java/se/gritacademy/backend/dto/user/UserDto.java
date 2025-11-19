package se.gritacademy.backend.dto.user;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class UserDto {
    private Long id;
    private String firstName;
    private String email;
    private UserRole role;

    // Only for Child
    private BigDecimal weekBalance;
    private int weekCompletedChoresCount;
}