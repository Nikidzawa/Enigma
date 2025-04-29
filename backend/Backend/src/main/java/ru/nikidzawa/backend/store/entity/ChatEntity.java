package ru.nikidzawa.backend.store.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity(name = "chat")
@Table(indexes = {
        @Index(name = "idx_chat_last_message_id", columnList = "last_message_id"),
})
public class ChatEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE,  generator = "chat_seq")
    @SequenceGenerator(name = "chat_seq", sequenceName = "chat_seq", initialValue = 1, allocationSize = 1)
    Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    ChatType type;

    @Column(name = "last_message_id")
    Integer lastMessageId;

    @Column(name = "created_at")
    LocalDateTime createdAt;
}