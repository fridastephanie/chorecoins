package se.gritacademy.backend.entity.user;

import jakarta.persistence.CascadeType;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;
import se.gritacademy.backend.entity.chore.Chore;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@DiscriminatorValue("PARENT")
public class Parent extends User {

    @OneToMany(mappedBy = "createdBy", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private Set<Chore> createdChores = new HashSet<>();

}
