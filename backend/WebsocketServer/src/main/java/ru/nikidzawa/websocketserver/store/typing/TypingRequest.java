package ru.nikidzawa.websocketserver.store.typing;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TypingRequest {
    String writerId;
    String targetId;
    Boolean isTyping;
}
