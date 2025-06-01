package ru.nikidzawa.websocketserver.store.typing;

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
public class TypingResponse {
    Boolean isTyping;
}