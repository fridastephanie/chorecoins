package se.gritacademy.backend.entity.user;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import se.gritacademy.backend.entity.family.Family;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "user_type")
@Table(name = "users")
public abstract class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 50)
    @Size(max = 50)
    private String firstName;

    @NotBlank
    @Column(unique = true, nullable = false)
    @Email
    private String email;

    @NotBlank
    @Column(nullable = false)
    private String passwordHash;

    // ROLE_CHILD / ROLE_PARENT
    @NotNull
    @Column(nullable = false)
    private String role;

    @ManyToMany(mappedBy = "members")
    private Set<Family> families = new HashSet<>();
}