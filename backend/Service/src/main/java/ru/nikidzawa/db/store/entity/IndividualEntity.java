package ru.nikidzawa.db.store.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

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

    @Column(name = "nickname", nullable = true, unique = true)
    String nickname;

    @Column(name = "password", nullable = false)
    String password;

    @Column(name = "name", nullable = false)
    String name;

    @Column(name = "surname", nullable = true)
    String surname;
}