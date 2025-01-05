package ru.nikidzawa.db.store.client.dataModel;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChatRoomDataModel {
    Long userId;
    String userName;
    String userSurname;

    Long lastMessageId;
    String lastMessageText;
    LocalDateTime lastMessageSendTime;
    Long lastMessageSenderId;

    Long chatId;

    public static class ChatRoomRowMapper implements RowMapper<ChatRoomDataModel> {
        @Override
        public ChatRoomDataModel mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new ChatRoomDataModel(
                    rs.getLong("user_id"),
                    rs.getString("user_name"),
                    rs.getString("user_surname"),
                    rs.getLong("last_message_id"),
                    rs.getString("last_message_text"),
                    rs.getObject("last_message_send_time", LocalDateTime.class),
                    rs.getLong("last_message_sender_id"),
                    rs.getLong("chat_id")
            );
        }
    }
}


