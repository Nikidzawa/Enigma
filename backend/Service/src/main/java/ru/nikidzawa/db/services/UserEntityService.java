package ru.nikidzawa.db.services;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import ru.nikidzawa.db.exceptions.NotFoundException;
import ru.nikidzawa.db.exceptions.UnauthorizedException;
import ru.nikidzawa.db.store.entities.UserEntity;
import ru.nikidzawa.db.store.repositories.UserEntityRepository;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserEntityService {

    UserEntityRepository repository;

    public UserEntity getUserById(Long userId) {
        return repository.findFirstById(userId)
                .orElseThrow(() -> new NotFoundException("Пользователь не найден"));
    }

    public UserEntity authenticate(String username, String password) {
        return repository.findFirstByNicknameAndPassword(username, password)
                .orElseThrow(() -> new UnauthorizedException("Не верное имя пользователя или пароль"));
    }
}
