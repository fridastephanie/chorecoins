package se.gritacademy.backend.entity.family;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import se.gritacademy.backend.entity.chore.Chore;
import se.gritacademy.backend.entity.user.User;
import se.gritacademy.backend.entity.weeklychildstats.WeeklyChildStats;

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

    @NotBlank
    @Column(nullable = false, length = 50)
    @Size(max = 50)
    private String familyName;

    @ManyToMany
    @JoinTable(
            name = "family_members",
            joinColumns = @JoinColumn(name = "family_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> members = new HashSet<>();

    @OneToMany(mappedBy = "family", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private Set<Chore> chores = new HashSet<>();

    @OneToMany(mappedBy = "family", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private Set<WeeklyChildStats> weeklyStats = new HashSet<>();

}