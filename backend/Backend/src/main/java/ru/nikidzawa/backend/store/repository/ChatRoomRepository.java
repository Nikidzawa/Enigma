package ru.nikidzawa.backend.store.repository;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import ru.nikidzawa.backend.store.client.dataModel.ChatRoomDataModel;

import java.util.List;

@Repository
@Transactional
public class ChatRoomRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<ChatRoomDataModel> findAllChatRoomsByUserId(Long userId) {
        String sql = """
        SELECT
            companion.id as user_id,
            companion.nickname as user_nickname,
            companion.name as user_name,
            companion.surname as user_surname,
            companion.birthdate as birthdate,
            companion.about_me as about_me,
            companion.avatar_href as avatar_href,
            chat.id as chat_id,
            chat.owner_id as chat_owner_id,
            chat.companion_id as chat_companion_id,
            chat.created_at as chat_created_at,
            last_message.*,
            COUNT(*) FILTER (WHERE m.is_read = false) OVER (PARTITION BY chat.id) AS unread_count
            FROM indiv_chat chat
            JOIN individual companion ON companion.id = chat.companion_id
            LEFT JOIN (
                SELECT m.*, ichat.indiv_chat_id, ROW_NUMBER() OVER (PARTITION BY ichat.indiv_chat_id ORDER BY m.id DESC) AS rn
                FROM messages m
                    JOIN indiv_chat_messages ichat ON ichat.message_id = m.id
                ) AS last_message ON last_message.indiv_chat_id = chat.id AND last_message.rn = 1
                WHERE chat.owner_id = ?;
        """;
        return jdbcTemplate.query(sql, new ChatRoomDataModel.ChatRoomRowMapper(), userId);
    }

}
