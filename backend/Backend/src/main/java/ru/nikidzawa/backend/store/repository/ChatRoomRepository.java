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
                    companion.last_logout_dt as last_logout_dt,
            last_message.id as last_message_id,
            last_message.text as last_message_text,
            last_message.created_at AS last_message_send_time,
            last_message.sender_id AS last_message_sender_id,
            last_message.is_read AS last_message_is_read,
            chat.id as chat_id,
            chat.owner_id as chat_owner_id,
            chat.companion_id as chat_companion_id,
            chat.created_at as chat_created_at,
            unread_count.*
        FROM indiv_chat chat
            JOIN individual companion on companion.id = chat.companion_id
            LEFT JOIN LATERAL (
            select m.* from messages m
            join indiv_chat_messages ichat on ichat.message_id = m.id and ichat.indiv_chat_id = chat.id
            order by m.id desc
            limit 1
            ) as last_message on true
            LEFT JOIN LATERAL (
            select COUNT(*) as unread_count from messages m
            join indiv_chat_messages ichat on ichat.message_id = m.id and ichat.indiv_chat_id = chat.id
            where m.is_read is false and m.sender_id = chat.companion_id 
            ) as unread_count on true
        WHERE chat.owner_id = ?
        """;
        return jdbcTemplate.query(sql, new ChatRoomDataModel.ChatRoomRowMapper(), userId);
    }

}
