package ru.nikidzawa.backend.store.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.boot.context.properties.bind.DefaultValue;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity(name = "messages")
@Table(indexes = {
        @Index(name = "idx_message_id", columnList = "id"),
        @Index(name = "idx_message_sender", columnList = "sender_id"),
        @Index(name = "idx_message_chat", columnList = "chat_id")
})
public class MessageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE,  generator = "message_seq")
    @SequenceGenerator(name = "message_seq", sequenceName = "message_seq", initialValue = 1, allocationSize = 1)
    Long id;

    @Column(name = "sender_id", nullable = false)
    Long senderId;

    @Column(name = "chat_id", nullable = false)
    Long chatId;

    @Column(name = "sent_at", nullable = false)
    LocalDateTime sentAt;

    @Column(name = "text", columnDefinition = "VARCHAR(2048)", nullable = false)
    String text;

    @Column(name = "is_pinned")
    Boolean isPinned = false;

    @Column(name = "is_edited")
    Boolean isEdited = false;

    @Column(name = "edited_at")
    LocalDateTime editedAt;

    @Column(name = "is_read")
    Boolean isRead = false;
}