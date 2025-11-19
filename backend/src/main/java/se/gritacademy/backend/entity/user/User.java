package se.gritacademy.backend.entity.user;

import jakarta.persistence.*;
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

    @Column(nullable = false)
    private String firstName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    // ROLE_CHILD / ROLE_PARENT
    @Column(nullable = false)
    private String role;

    @ManyToMany(mappedBy = "members")
    private Set<Family> families = new HashSet<>();
}