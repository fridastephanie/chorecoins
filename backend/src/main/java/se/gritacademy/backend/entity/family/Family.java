package se.gritacademy.backend.entity.family;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import se.gritacademy.backend.entity.user.User;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "families")
public class Family {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String familyName;

    @ManyToMany
    @JoinTable(
            name = "family_members",
            joinColumns = @JoinColumn(name = "family_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> members = new HashSet<>();

}