package ru.nikidzawa.websocketserver.store.message;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

/**
 * @author Nikidzawa
 */
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChatMessageNewResponse {
    String id;
    String createdAt;
    String senderId;
    String receiverId;
    String chatId;
    String message;
}
