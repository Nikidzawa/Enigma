package ru.nikidzawa.backend.store.entity;

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
@Entity(name = "indiv_chat")
@Table(indexes = {
        @Index(name = "idx_indiv_chat_owner", columnList = "owner_id"),
        @Index(name = "idx_indiv_chat_companion", columnList = "companion_id"),
        @Index(name = "idx_indiv_chat_owner_companion", columnList = "owner_id, companion_id", unique = true)
})
public class IndividualChatEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE,  generator = "indiv_chat_seq")
    @SequenceGenerator(name = "indiv_chat_seq", sequenceName = "indiv_chat_seq", initialValue = 1, allocationSize = 1)
    Long id;

    @Column(name = "owner_id", nullable = false)
    Long ownerId;

    @Column(name = "companion_id", nullable = false)
    Long companionId;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "indiv_chat_messages",
            joinColumns = @JoinColumn(name = "indiv_chat_id"),
            inverseJoinColumns = @JoinColumn(name = "message_id")
    )
    List<MessageEntity> messages;

    @Column(name = "created_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    LocalDateTime createdAt;
}
