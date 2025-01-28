package ru.nikidzawa.db.services;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import ru.nikidzawa.db.controllers.responses.JwtTokenResponse;
import ru.nikidzawa.db.exceptions.UnauthorizedException;
import ru.nikidzawa.db.store.entity.IndividualEntity;
import ru.nikidzawa.db.store.repository.UserEntityRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserEntityService {

    UserEntityRepository repository;

    JWTService jwtService;

    public JwtTokenResponse authenticate(String nicknameOrEmail, String password) {
        Optional<IndividualEntity> individualEntity = repository.findFirstByEmailOrNicknameAndPassword(nicknameOrEmail, password);
        if (individualEntity.isPresent()) {
            IndividualEntity individual = individualEntity.get();
            return JwtTokenResponse.builder()
                    .user(individual)
                    .token(jwtService.generateToken(individual.getNickname()))
                    .build();
        } else {
            throw new UnauthorizedException("Неверный логин или пароль");
        }
    }

    public JwtTokenResponse save(IndividualEntity individualEntity) {
        IndividualEntity savedUser = repository.saveAndFlush(individualEntity);
        savedUser.setNickname(String.format("id:%d", individualEntity.getId()));
        savedUser = repository.saveAndFlush(savedUser);
        return JwtTokenResponse.builder()
                .user(savedUser)
                .token(jwtService.generateToken(savedUser.getNickname()))
                .build();
    }

    public Boolean emailIsUsed(String email) {
        return repository.existsByEmail(email);
    }
}
