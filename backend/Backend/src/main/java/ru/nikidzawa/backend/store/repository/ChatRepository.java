package ru.nikidzawa.backend.store.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.nikidzawa.backend.store.entity.ChatEntity;

import java.util.Optional;

public interface ChatRepository extends JpaRepository<ChatEntity, Long> {
}
