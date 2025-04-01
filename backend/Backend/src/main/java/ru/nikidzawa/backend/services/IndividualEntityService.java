package ru.nikidzawa.backend.services;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import ru.nikidzawa.backend.controllers.responses.JwtTokenResponse;
import ru.nikidzawa.backend.exceptions.NotFoundException;
import ru.nikidzawa.backend.exceptions.UnauthorizedException;
import ru.nikidzawa.backend.store.client.dto.IndividualDtoShort;
import ru.nikidzawa.backend.store.client.factory.IndividualDtoShortFactory;
import ru.nikidzawa.backend.store.entity.IndividualEntity;
import ru.nikidzawa.backend.store.repository.IndividualEntityRepository;

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
        savedUser.setNickname(individualEntity.getId().toString());
        savedUser = repository.saveAndFlush(savedUser);
        return JwtTokenResponse.builder()
                .user(savedUser)
                .token(jwtService.generateToken(savedUser.getNickname()))
                .build();
    }

    public void edit(IndividualDtoShort individualDtoShort) {
        IndividualEntity individualEntity = repository.findById(individualDtoShort.getId())
                .orElseThrow(() -> new NotFoundException("Пользователя не существует"));
        individualEntity.setName(individualDtoShort.getName().trim());
        individualEntity.setSurname(individualDtoShort.getSurname().trim());
        individualEntity.setNickname(individualDtoShort.getNickname().toLowerCase().replace(" ", ""));
        individualEntity.setBirthdate(individualDtoShort.getBirthdate());
        individualEntity.setAboutMe(individualDtoShort.getAboutMe().trim());
        individualEntity.setAvatarHref(individualDtoShort.getAvatarHref());
        repository.saveAndFlush(individualEntity);
    }

    public IndividualEntity findByToken(String token) {
        String nickname = jwtService.extractUserName(token);
        return repository.findFirstByNickname(nickname)
                .orElseThrow(() -> new UnauthorizedException("Пользователь не найден"));
    }

    public Boolean emailIsUsed(String email) {
        return repository.existsByEmail(email);
    }

    public Boolean nicknameIsUsed(String nickname, Long userId) {
        return repository.findFirstByNicknameAndIdNot(nickname, userId).isPresent();
    }

    public List<IndividualDtoShort> search (String value, Long userId) {
        return repository.search(value, userId).stream()
                .map(IndividualDtoShortFactory::convert)
                .toList();
    }

    public IndividualEntity getUserById (Long userId) {
        return repository.findById(userId).get();
    }
}