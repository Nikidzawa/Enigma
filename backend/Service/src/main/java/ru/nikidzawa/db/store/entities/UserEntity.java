package ru.nikidzawa.db.store.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity(name = "users")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    Long id;

    @Column(name = "nickname", nullable = false)
    String nickname;

    @Column(name = "password", nullable = false)
    String password;

    @Column(name = "name", nullable = false)
    String name;

    @Column(name = "surname", nullable = true)
    String surname;
}