package ru.nikidzawa.db.controllers;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;
import ru.nikidzawa.db.controllers.responses.JwtTokenResponse;
import ru.nikidzawa.db.services.IndividualEntityService;
import ru.nikidzawa.db.store.client.dto.IndividualDtoShort;
import ru.nikidzawa.db.store.client.factory.IndividualDtoShortFactory;
import ru.nikidzawa.db.store.entity.IndividualEntity;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("users/")
@CrossOrigin
public class IndividualEntityController {

    private static final String SAVE = "save";
    private static final String EDIT = "edit";
    private static final String LOGIN = "login";
    private static final String SEARCH = "search";
    private static final String EXISTS_BY_EMAIL = "existsBy";
    private static final String EXISTS_BY_NICKNAME = "existsByNickname";
    private static final String FIND_BY_TOKEN = "findBy";
    private static final String GET_BY_ID = "{userId}";


    IndividualEntityService service;

    @GetMapping(LOGIN)
    public JwtTokenResponse userAuthenticate(@RequestParam String nicknameOrEmail,
                                             @RequestParam String password) {
        return service.authenticate(nicknameOrEmail, password);
    }

    @GetMapping(EXISTS_BY_EMAIL)
    public Boolean emailIsUsed(@RequestParam String email) {
        return service.emailIsUsed(email);
    }

    @GetMapping(EXISTS_BY_NICKNAME)
    public Boolean nicknameIsUsed(@RequestParam String nickname, @RequestParam Long userId) {
        return service.nicknameIsUsed(nickname, userId);
    }

    @GetMapping(FIND_BY_TOKEN)
    public IndividualEntity findByToken(@RequestParam String token) {
        return service.findByToken(token);
    }

    @GetMapping(SEARCH)
    public List<IndividualDtoShort> search (@RequestParam String value, @RequestParam Long userId) {
        return service.search(value, userId);
    }

    @PutMapping(EDIT)
    public void edit(@RequestBody IndividualDtoShort individualDtoShort) {
        service.edit(individualDtoShort);
    }

    @PostMapping(SAVE)
    public JwtTokenResponse save(@RequestBody IndividualEntity individualEntity) {
        return service.save(individualEntity);
    }

    @GetMapping(GET_BY_ID)
    public IndividualEntity getUserById (@PathVariable Long userId) {
        return service.getUserById(userId);
    }
}