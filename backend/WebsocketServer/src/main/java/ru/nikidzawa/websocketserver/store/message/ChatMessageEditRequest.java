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
public class ChatMessageEditRequest {
    String subscriberId;
    String chatId;
    String messageId;
    String editedAt;
    String text;
}
