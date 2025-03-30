package ru.nikidzawa.db.store.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity(name = "individual")
public class IndividualEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE,  generator = "individual_seq")
    @SequenceGenerator(name = "individual_seq", sequenceName = "individual_seq", initialValue = 1, allocationSize = 1)
    Long id;

    @Column(name = "email", nullable = false, unique = true)
    String email;

    @Column(name = "nickname", nullable = true, unique = true, length = 30)
    String nickname;

    @Column(name = "password", nullable = false)
    String password;

    @Column(name = "name", nullable = false, length = 25)
    String name;

    @Column(name = "surname", nullable = true, length = 25)
    String surname;

    @Column(name = "birthdate", nullable = true)
    LocalDate birthdate;

    @Column(name = "about_me", nullable = true, length = 120)
    String aboutMe;

    @Column(name = "last_online", nullable = true)
    LocalDateTime lastOnline;

    @Column(name = "avatar_href", nullable = true)
    String avatarHref;
}