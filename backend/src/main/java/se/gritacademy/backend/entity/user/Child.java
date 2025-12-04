package se.gritacademy.backend.entity.user;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import se.gritacademy.backend.entity.chore.Chore;
import se.gritacademy.backend.entity.weeklychildstats.WeeklyChildStats;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@DiscriminatorValue("CHILD")
public class Child extends User {

    @OneToMany(mappedBy = "assignedTo", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private Set<Chore> chores = new HashSet<>();

    @OneToMany(mappedBy = "child", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private Set<WeeklyChildStats> weeklyStats = new HashSet<>();

}
