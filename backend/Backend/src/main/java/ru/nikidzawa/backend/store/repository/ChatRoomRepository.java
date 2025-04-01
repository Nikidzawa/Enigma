package ru.nikidzawa.backend.store.repository;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import ru.nikidzawa.backend.store.client.dataModel.ChatRoomDataModel;

import java.util.List;

@Repository
public class ChatRoomRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Transactional
    public List<ChatRoomDataModel> findAllChatRoomsByUserId(Long userId) {
        String sql = """
                SELECT 
                    i.id as user_id,
                    i.nickname as user_nickname,
                    i.name as user_name,
                    i.surname as user_surname,
                    i.avatar_href as avatar_href,
                    i.last_online as last_online,
                    last_message.id as last_message_id,
                    last_message.text as last_message_text,
                    last_message.created_at AS last_message_send_time,
                    last_message.sender_id AS last_message_sender_id,
                    chat.id as chat_id,
                    chat.owner_id as chat_owner_id,
                    chat.companion_id as chat_companion_id,
                    chat.created_at as chat_created_at
                FROM indiv_chat chat
                    JOIN individual i on i.id = chat.companion_id
                    LEFT JOIN LATERAL (
                        select m.* from indiv_chat_messages ichat
                        join messages m on m.id = ichat.message_id
                        order by m.id desc
                        limit 1
                        ) as last_message on true
                WHERE chat.owner_id = ?
                """;
        return jdbcTemplate.query(sql, new ChatRoomDataModel.ChatRoomRowMapper(), userId);
    }

}
