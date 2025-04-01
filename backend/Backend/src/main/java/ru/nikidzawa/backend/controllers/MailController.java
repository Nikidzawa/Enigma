package ru.nikidzawa.backend.controllers;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;
import ru.nikidzawa.backend.services.MailService;
import ru.nikidzawa.backend.store.client.dto.EmailCodeDto;

@CrossOrigin
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("mail/")
public class MailController {

    MailService service;

    private static final String SEND_AUTH_CODE = "sendAuthCode/{mail}";

    @PostMapping(SEND_AUTH_CODE)
    public EmailCodeDto sendAuthCode(@PathVariable String mail) {
        String code = service.sendMessage(mail);
        return EmailCodeDto.builder()
                .code(code)
                .email(mail)
                .build();
    }
}
