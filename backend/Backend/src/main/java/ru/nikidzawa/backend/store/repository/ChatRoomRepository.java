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

    public List<ChatRoomDataModel> getAllByOwner(Long ownerId) {
        String sql = """
        SELECT 
        pc.owner_id as owner_id,    
        i.id as individual_id,
        i.avatar_href,
        i.name,
        i.nickname,
        i.surname,
        i.about_me,
        i.birth_date,
        i.last_logout_dt,
        c.id as chat_id,
        c.type as chat_type,
        lm.id as last_message_id,
        lm.sender_id,
        lm.sent_at,
        lm.text,
        lm.is_pinned,
        lm.is_edited,
        lm.edited_at,
        lm.is_read,
        unread_count.count as unread_count
        from private_chat pc
        join chat c on c.id = pc.chat_id
        join individual i on i.id = pc.companion_id
        left join messages lm on lm.id = c.last_message_id
        left join lateral ( 
            select count(m) from messages m
            where m.chat_id = c.id and m.is_read = false and m.sender_id != ?
        ) as unread_count on true
        where pc.owner_id = ?
        """;
        return jdbcTemplate.query(sql, new ChatRoomDataModel.ChatRoomRowMapper(), ownerId, ownerId);
    }

}
