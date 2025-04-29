package ru.nikidzawa.backend.store.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity(name = "private_chat")
@Table(indexes = {
        @Index(name = "idx_private_chat_id", columnList = "chat_id"),
        @Index(name = "idx_private_chat_owner", columnList = "owner_id"),
        @Index(name = "idx_private_chat_companion", columnList = "companion_id"),
        @Index(name = "idx_private_chat_owner_companion", columnList = "owner_id, companion_id", unique = true)
})
@IdClass(PrivateChatEntity.ChatOwnerId.class)
public class PrivateChatEntity {
    @Id
    @Column(name = "chat_id", nullable = false)
    Long chatId;

    @Id
    @Column(name = "owner_id", nullable = false)
    Long ownerId;

    @Column(name = "companion_id", nullable = false)
    Long companionId;

    @Embeddable
    public static class ChatOwnerId implements Serializable {
        private Long chatId;
        private Long ownerId;
    }
}
