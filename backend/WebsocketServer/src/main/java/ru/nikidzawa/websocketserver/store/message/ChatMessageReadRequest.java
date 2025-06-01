package ru.nikidzawa.websocketserver.store.message;

import lombok.*;
import lombok.experimental.FieldDefaults;

/**
 * @author Nikidzawa
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChatMessageReadRequest {
    String subscriberId;
    String chatId;
    String messageId;
}
