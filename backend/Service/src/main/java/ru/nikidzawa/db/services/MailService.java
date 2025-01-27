package ru.nikidzawa.db.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

import java.util.Random;

@Component
public class MailService {

    @Autowired
    JavaMailSender mailSender;

    private static final int codeLength = 4;

    public String sendMessage(String mail) {
        String code = generateRandomCode();

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("enigma-messenger@mail.ru");
        message.setTo(mail);
        message.setSubject("Код подтверждения Enigma Messenger");
        message.setText("Ваш код подтверждения " + code);
        mailSender.send(message);
        return code;
    }

    private String generateRandomCode() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder code = new StringBuilder();
        Random random = new Random();

        for (int i = 0; i < codeLength; i++) {
            int index = random.nextInt(characters.length());
            code.append(characters.charAt(index));
        }

        return code.toString();
    }
}
