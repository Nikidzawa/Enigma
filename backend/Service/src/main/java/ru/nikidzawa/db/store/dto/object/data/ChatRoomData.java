package ru.nikidzawa.db.store.dto.object.data;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;

/**
 * В DTO входит сущность чата + сущность пользователя + сущность последнего сообщения
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomData {
    Long userId;
    String userName;
    String userSurname;

    Long lastMessageId;
    String lastMessageText;
    LocalDateTime lastMessageSendTime;
    Long lastMessageSenderId;

    Long chatId;
    Boolean isGroupChat;
    String chatName;

    public static class ChatRoomRowMapper implements RowMapper<ChatRoomData> {
        @Override
        public ChatRoomData mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new ChatRoomData(
                    rs.getLong("userId"),
                    rs.getString("userName"),
                    rs.getString("userSurname"),
                    rs.getLong("lastMessageId"),
                    rs.getString("lastMessageText"),
                    rs.getObject("lastMessageSendTime", LocalDateTime.class),
                    rs.getLong("lastMessageSenderId"),
                    rs.getLong("chatId"),
                    rs.getBoolean("isGroupChat"),
                    rs.getString("chatName")
            );
        }
    }
}


