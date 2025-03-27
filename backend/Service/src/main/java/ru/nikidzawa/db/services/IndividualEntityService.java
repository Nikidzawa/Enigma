package ru.nikidzawa.db.services;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import ru.nikidzawa.db.controllers.responses.JwtTokenResponse;
import ru.nikidzawa.db.exceptions.UnauthorizedException;
import ru.nikidzawa.db.store.entity.IndividualEntity;
import ru.nikidzawa.db.store.repository.IndividualEntityRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class IndividualEntityService {

    IndividualEntityRepository repository;

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

    public IndividualEntity findByToken(String token) {
        String nickname = jwtService.extractUserName(token);
        return repository.findFirstByNickname(nickname)
                .orElseThrow(() -> new UnauthorizedException("Пользователь не найден"));
    }

    public Boolean emailIsUsed(String email) {
        return repository.existsByEmail(email);
    }

    public List<IndividualEntity> search (String value, Long userId) {
        return repository.search(value, userId);
    }
}