package se.gritacademy.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se.gritacademy.backend.entity.user.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

}