package ru.nikidzawa.db.store.repository;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import ru.nikidzawa.db.store.client.dataModel.MessageDataModel;

import java.util.List;

@Repository
public class IndivChatMessagesRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<MessageDataModel> getByChatIdAndLastMessageId (Long chatId, Long lastMessageId) {
        String sql = """
                SELECT m.* FROM indiv_chat_messages chat_messages
                join messages m on m.id = chat_messages.message_id
                where chat_messages.indiv_chat_id = ? and m.id < ?
                ORDER BY m.id DESC
                LIMIT 30
                """;
        return jdbcTemplate.query(sql, new MessageDataModel.MessageRowMapper(), chatId, lastMessageId);
    }

    public List<MessageDataModel> getByChatId (Long chatId) {
        String sql = """
                SELECT m.* FROM indiv_chat_messages chat_messages
                join messages m on m.id = chat_messages.message_id
                where chat_messages.indiv_chat_id = ?
                ORDER BY m.id DESC
                LIMIT 30
                """;
        return jdbcTemplate.query(sql, new MessageDataModel.MessageRowMapper(), chatId);
    }

    @Transactional
    public void saveIndivChatMessage (Long chatId, Long messageId) {
        String sql = String.format("INSERT INTO indiv_chat_messages (indiv_chat_id, message_id) VALUES (%d, %d)", chatId, messageId);
        jdbcTemplate.execute(sql);
    }
}
