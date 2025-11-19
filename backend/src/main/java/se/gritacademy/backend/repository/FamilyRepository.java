package se.gritacademy.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se.gritacademy.backend.entity.family.Family;

public interface FamilyRepository extends JpaRepository<Family, Long> {

}