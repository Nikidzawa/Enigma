package ru.nikidzawa.backend.store.client.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class IndividualDtoShort {
    Long id;
    String nickname;
    String name;
    String surname;
    LocalDate birthdate;
    String aboutMe;
    LocalDateTime lastOnline;
    String avatarHref;
}
