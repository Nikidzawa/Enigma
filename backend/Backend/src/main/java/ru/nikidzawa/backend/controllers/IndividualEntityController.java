package ru.nikidzawa.backend.controllers;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;
import ru.nikidzawa.backend.controllers.responses.JwtTokenResponse;
import ru.nikidzawa.backend.services.IndividualEntityService;
import ru.nikidzawa.backend.store.client.dto.IndividualDtoShort;
import ru.nikidzawa.backend.store.client.factory.IndividualDtoFactory;
import ru.nikidzawa.backend.store.entity.IndividualEntity;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("users")
@CrossOrigin
public class IndividualEntityController {

    private static final String SAVE = "/save";
    private static final String EDIT = "/edit";
    private static final String EDIT_NICKNAME = "/{userId}/edit/nickname";
    private static final String LOGIN = "/login";
    private static final String SEARCH = "/search";
    private static final String EXISTS_BY_EMAIL = "/existsByEmail";
    private static final String FIND_BY_TOKEN = "/findByToken";
    private static final String GET_BY_ID = "/{userId}";

    IndividualEntityService service;

    IndividualDtoFactory factory;

    @GetMapping(LOGIN)
    public JwtTokenResponse userAuthenticate(@RequestParam String nicknameOrEmail,
                                             @RequestParam String password) {
        return service.authenticate(nicknameOrEmail, password);
    }

    @GetMapping(EXISTS_BY_EMAIL)
    public Boolean emailIsUsed(@RequestParam String email) {
        return service.emailIsUsed(email);
    }

    @PutMapping(EDIT_NICKNAME)
    public Boolean editNickname(@PathVariable Long userId, @RequestParam String value) {
        return service.editNickname(userId, value.replaceAll(" ", ""));
    }

    @GetMapping(FIND_BY_TOKEN)
    public IndividualDtoShort findByToken(@RequestParam String token) {
        IndividualEntity individual = service.findByToken(token);
        return factory.convert(individual);
    }

    @GetMapping(SEARCH)
    public List<IndividualDtoShort> search (@RequestParam String value, @RequestParam Long userId) {
        return service.search(value, userId);
    }

    @PutMapping(EDIT)
    public IndividualDtoShort edit(@RequestBody IndividualDtoShort individualDtoShort) {
        IndividualEntity individual = service.edit(individualDtoShort);
        return factory.convert(individual);
    }

    @PostMapping(SAVE)
    public JwtTokenResponse save(@RequestBody IndividualEntity individualEntity) {
        return service.save(individualEntity);
    }

    @GetMapping(GET_BY_ID)
    public IndividualDtoShort getShortUserById(@PathVariable Long userId) {
        IndividualEntity individual = service.findById(userId);
        return factory.convert(individual);
    }
}