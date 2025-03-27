package ru.nikidzawa.db.store.client.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

/**
 * @author Nikidzawa
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmailCodeDto {
    String code;
    String email;
}
