package ru.nikidzawa.websocketserver.store;

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
public class ChatMessage {
    String id;
    String createdAt;
    String senderId;
    String receiverId;
    String message;
}
