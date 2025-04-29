package ru.nikidzawa.backend.store.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;
import lombok.experimental.FieldDefaults;


@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity(name = "group_chat")
public class GroupChatEntity {
    @Id
    @Column(name = "chat_id")
    Long chatId;

    @Column(name = "name")
    String name;

    @Column(name = "description")
    String description;

    @Column(name = "avatar_href")
    String avatarHref;
}
