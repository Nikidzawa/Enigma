package ru.nikidzawa.db.store.dto.object.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageDto {
    Long id;
    LocalDateTime createdAt;
    String text;
    Long senderId;
}
