package ru.nikidzawa.backend.store.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;
import lombok.experimental.FieldDefaults;

/**
 * @author Nikidzawa
 */
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity(name = "private_chat_deleted_messages")
public class PrivateChatDeletedMessagesEntity {
    @Id
    Long messageId;

    Long chatId;

    Long userId;
}
