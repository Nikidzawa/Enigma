package ru.nikidzawa.backend.services;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import ru.nikidzawa.backend.store.repository.IndividualPresenceRepository;

import java.time.LocalDateTime;

/**
 * @author Nikidzawa
 */
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PACKAGE, makeFinal = true)
public class KafkaConsumerService {

    IndividualPresenceRepository individualPresenceRepository;

    @KafkaListener(topics = "logout-topic", groupId = "user")
    public void logoutTopicListener(String userId) {
        individualPresenceRepository.findById(Long.valueOf(userId)).ifPresent(userPresence -> {
            userPresence.setLastOnlineDate(LocalDateTime.now());
            userPresence.setIsOnline(false);
            individualPresenceRepository.saveAndFlush(userPresence);
        });
    }

    @KafkaListener(topics = "login-topic", groupId = "user")
    public void loginTopicListener(String userId) {
        individualPresenceRepository.findById(Long.valueOf(userId)).ifPresent(userPresence -> {
            userPresence.setLastOnlineDate(LocalDateTime.now());
            userPresence.setIsOnline(true);
            individualPresenceRepository.saveAndFlush(userPresence);
        });
    }
}
