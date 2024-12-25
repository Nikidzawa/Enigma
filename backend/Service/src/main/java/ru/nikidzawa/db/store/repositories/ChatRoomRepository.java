package ru.nikidzawa.db.store.repositories;

import jakarta.transaction.Transactional;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import ru.nikidzawa.db.store.dto.object.data.ChatRoomData;

import java.util.List;

@Repository
public class ChatRoomRepository {
    private final JdbcTemplate jdbcTemplate;

    public ChatRoomRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Transactional
    public List<ChatRoomData> findAllChatRoomsByUserId(Long userId) {
        String sql = """
            SELECT 
                participant.id AS userId, 
                participant.name AS userName, 
                participant.surname AS userSurname, 
                last_message.id AS lastMessageId, 
                last_message.text AS lastMessageText, 
                last_message.created_at AS lastMessageSendTime, 
                last_message.sender_id AS lastMessageSenderId,
                c.id AS chatId, 
                c.is_group AS isGroupChat, 
                COALESCE(c.name, participant.name) AS chatName
            FROM chats c
                JOIN chat_users cu ON cu.chat_id = c.id
                LEFT JOIN LATERAL (select u2.* from chat_users c2 join users u2 on c2.user_id = u2.id where c2.chat_id = c.id and c2.user_id <> ?) as participant on true
                LEFT JOIN LATERAL (select m.* from messages m where m.chat_id = c.id order by m.id desc limit 1) as last_message on true
            WHERE cu.user_id = ?
            """;

        return jdbcTemplate.query(sql, new ChatRoomData.ChatRoomRowMapper(), userId, userId);
    }
}
