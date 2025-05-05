package ru.nikidzawa.backend.store.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.nikidzawa.backend.store.entity.PrivateChatDeletedMessagesEntity;

/**
 * @author Nikidzawa
 */
public interface PrivateChatDeletedMessagesRepository extends JpaRepository<PrivateChatDeletedMessagesEntity, Long> {
}
