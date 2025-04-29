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
@Entity(name = "group_chat_members")
@IdClass(GroupChatMembers.ChatMemberId.class)
public class GroupChatMembers {
    @Id
    @Column(name = "chat_id", nullable = false)
    Long chatId;

    @Id
    @Column(name = "user_id", nullable = false)
    Long userId;

    @Column(name = "joined_at", nullable = false)
    LocalDateTime joinedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    GroupChatRole role;

    @Embeddable
    public static class ChatMemberId implements Serializable {
        private Long chatId;
        private Long userId;
    }
}


