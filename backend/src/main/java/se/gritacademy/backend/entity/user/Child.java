package se.gritacademy.backend.entity.user;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@DiscriminatorValue("CHILD")
public class Child extends User {

    private BigDecimal weekBalance = BigDecimal.ZERO;
    private int completedChoresCount = 0;

}
