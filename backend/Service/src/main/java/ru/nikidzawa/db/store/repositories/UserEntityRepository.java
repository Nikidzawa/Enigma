package ru.nikidzawa.db.store.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.nikidzawa.db.store.entities.UserEntity;

import java.util.Optional;

@Repository
public interface UserEntityRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findFirstByNicknameAndPassword(String username, String password);
    Optional<UserEntity> findFirstById(Long id);
}
