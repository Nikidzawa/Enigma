package ru.nikidzawa.backend.store.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ru.nikidzawa.backend.store.entity.MessageEntity;

import java.util.List;

@Repository
public interface MessageEntityRepository extends JpaRepository<MessageEntity, Long> {
    @Query(nativeQuery = true, value =
            """
            SELECT * FROM messages
            WHERE chat_id = :chatId and id < :lastMessageId
            ORDER BY id DESC
            LIMIT 30
            """)
    List<MessageEntity> getByChatIdAndLastMessageId(Long chatId, Long lastMessageId);

    @Query(nativeQuery = true, value =
            """
            SELECT * FROM messages
            WHERE chat_id = :chatId
            ORDER BY id DESC
            LIMIT 30
            """)
    List<MessageEntity> getByChatId(Long chatId);
}