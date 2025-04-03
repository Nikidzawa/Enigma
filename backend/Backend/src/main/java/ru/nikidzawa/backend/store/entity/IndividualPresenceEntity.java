package ru.nikidzawa.backend.store.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

/**
 * @author Nikidzawa
 */
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity(name = "individual_presence")
public class IndividualPresenceEntity {
    @Id
    @Column(name = "individual_id")
    Long individualId;

    @Column(name = "is_online", nullable = false)
    Boolean isOnline;

    @Column(name = "last_online", nullable = false)
    LocalDateTime lastOnlineDate;
}
