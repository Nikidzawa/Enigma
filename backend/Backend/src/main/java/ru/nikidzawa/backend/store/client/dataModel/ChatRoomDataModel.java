package ru.nikidzawa.backend.store.client.dataModel;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChatRoomDataModel {
    Long userId;
    String userNickname;
    String userName;
    String userSurname;
    LocalDate birthdate;
    String aboutMe;
    String avatarHref;
    LocalDateTime lastLogoutDate;

    Long lastMessageId;
    String lastMessageText;
    LocalDateTime lastMessageSendTime;
    Long lastMessageSenderId;
    Boolean lastMessageIsRead;
    Integer unreadCount;

    Long chatId;
    Long ownerId;
    Long companionId;
    LocalDateTime createdAt;

    public static class ChatRoomRowMapper implements RowMapper<ChatRoomDataModel> {
        @Override
        public ChatRoomDataModel mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new ChatRoomDataModel(
                    rs.getLong("user_id"),
                    rs.getString("user_nickname"),
                    rs.getString("user_name"),
                    rs.getString("user_surname"),
                    rs.getObject("birthdate", LocalDate.class),
                    rs.getString("about_me"),
                    rs.getString("avatar_href"),
                    rs.getObject("last_logout_dt", LocalDateTime.class),

                    rs.getLong("last_message_id"),
                    rs.getString("last_message_text"),
                    rs.getObject("last_message_send_time", LocalDateTime.class),
                    rs.getLong("last_message_sender_id"),
                    rs.getBoolean("last_message_is_read"),
                    rs.getInt("unread_count"),

                    rs.getLong("chat_id"),
                    rs.getLong("chat_owner_id"),
                    rs.getLong("chat_companion_id"),
                    rs.getObject("chat_created_at", LocalDateTime.class)
            );
        }
    }
}


