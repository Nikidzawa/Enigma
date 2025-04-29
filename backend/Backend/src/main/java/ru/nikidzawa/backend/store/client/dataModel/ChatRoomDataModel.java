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
    Long ownerId;

    Long individualId;
    String avatarHref;
    String name;
    String nickname;
    String surname;
    String aboutMe;
    LocalDate birthDate;
    LocalDateTime lastLogoutDt;

    Long chatId;
    String chatType;

    Long lastMessageId;
    Long senderId;
    LocalDateTime sentAt;
    String text;
    Boolean isPinned;
    Boolean isEdited;
    LocalDateTime editedAt;
    Boolean isRead;
    Integer unreadCount;

    public static class ChatRoomRowMapper implements RowMapper<ChatRoomDataModel> {
        @Override
        public ChatRoomDataModel mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new ChatRoomDataModel(
                    rs.getLong("owner_id"),
                    rs.getLong("individual_id"),
                    rs.getString("avatar_href"),
                    rs.getString("name"),
                    rs.getString("nickname"),
                    rs.getString("surname"),
                    rs.getString("about_me"),
                    rs.getObject("birth_date", LocalDate.class),
                    rs.getObject("last_logout_dt", LocalDateTime.class),

                    rs.getLong("chat_id"),
                    rs.getString("chat_type"),

                    rs.getLong("last_message_id"),
                    rs.getLong("sender_id"),
                    rs.getObject("sent_at", LocalDateTime.class),
                    rs.getString("text"),
                    rs.getBoolean("is_pinned"),
                    rs.getBoolean("is_edited"),
                    rs.getObject("edited_at", LocalDateTime.class),
                    rs.getBoolean("is_read"),
                    rs.getInt("unread_count")
            );
        }
    }
}


