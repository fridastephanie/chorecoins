package se.gritacademy.backend.entity.weeklychildstats;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;
import se.gritacademy.backend.entity.family.Family;
import se.gritacademy.backend.entity.user.User;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "weekly_child_stats")
public class WeeklyChildStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "child_id", nullable = false)
    private User child;

    @ManyToOne
    @JoinColumn(name = "family_id", nullable = false)
    private Family family;

    @Column(nullable = false)
    @Min(value = 1)
    @Max(value = 52)
    private Integer weekNumber;

    @Column(nullable = false)
    @Min(value = 2020)
    private Integer year;

    @Column
    private Integer completedChoresCount;

    @Column
    private BigDecimal earnedCoins;

}
