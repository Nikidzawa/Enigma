package ru.nikidzawa.backend.store.client.dataModel;

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
public class MessageDataModel {
    Long id;
    Long senderId;
    LocalDateTime createdAt;
    String text;
    Boolean isRead;

    public static class MessageRowMapper implements RowMapper<MessageDataModel> {
        @Override
        public MessageDataModel mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new MessageDataModel(
                    rs.getLong("id"),
                    rs.getLong("sender_id"),
                    rs.getObject("created_at", LocalDateTime.class),
                    rs.getString("text"),
                    rs.getBoolean("is_read")
            );
        }
    }
}
