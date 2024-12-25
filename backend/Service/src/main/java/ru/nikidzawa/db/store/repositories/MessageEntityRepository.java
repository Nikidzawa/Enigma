package ru.nikidzawa.db.store.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.nikidzawa.db.store.entities.MessageEntity;

import java.util.List;

@Repository
public interface MessageEntityRepository extends JpaRepository<MessageEntity, Long> {
    List<MessageEntity> findTop20ByChatIdAndIdLessThanOrderById(Long chatId, Long id);
    List<MessageEntity> findTop20ByChatIdOrderById(Long chatId);
}
