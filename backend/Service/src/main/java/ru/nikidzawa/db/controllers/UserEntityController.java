package ru.nikidzawa.db.controllers;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;
import ru.nikidzawa.db.controllers.responses.JwtTokenResponse;
import ru.nikidzawa.db.services.UserEntityService;
import ru.nikidzawa.db.store.entity.IndividualEntity;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("users/")
@CrossOrigin
public class UserEntityController {

    private static final String SAVE = "save";
    private static final String LOGIN = "login";
    private static final String EXISTS_BY_EMAIL = "existsBy";
    private static final String FIND_BY_TOKEN = "findBy";

    UserEntityService service;

    @GetMapping(LOGIN)
    public JwtTokenResponse userAuthenticate(@RequestParam String nicknameOrEmail,
                                             @RequestParam String password) {
        return service.authenticate(nicknameOrEmail, password);
    }

    @GetMapping(EXISTS_BY_EMAIL)
    public Boolean emailIsUsed(@RequestParam String email) {
        return service.emailIsUsed(email);
    }

    @GetMapping(FIND_BY_TOKEN)
    public IndividualEntity findByToken(@RequestParam String token) {
        return service.findByToken(token);
    }


    @PostMapping(SAVE)
    public JwtTokenResponse save(@RequestBody IndividualEntity individualEntity) {
        return service.save(individualEntity);
    }
}