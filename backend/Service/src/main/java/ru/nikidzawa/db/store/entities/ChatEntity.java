package ru.nikidzawa.db.store.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity(name = "chats")
public class ChatEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    Long id;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "chat_users",
            joinColumns = @JoinColumn(name = "chat_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    List<UserEntity> participants;

    @Column(name = "created_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    LocalDateTime createdAt;

    @Column(name = "is_group", nullable = false)
    Boolean isGroup;

    // Имя чата - только для групповых чатов. Иначе имя пользователя
    @Column(name = "name", nullable = true)
    String chatName;
}
