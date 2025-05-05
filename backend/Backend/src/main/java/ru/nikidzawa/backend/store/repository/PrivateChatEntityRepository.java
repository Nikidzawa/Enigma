package ru.nikidzawa.backend.store.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ru.nikidzawa.backend.store.entity.PrivateChatEntity;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrivateChatEntityRepository extends JpaRepository<PrivateChatEntity, Long> {

    Optional<PrivateChatEntity> findByOwnerIdAndCompanionId(Long ownerId, Long companionId);
}
