package ru.nikidzawa.backend.services;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import ru.nikidzawa.backend.store.repository.IndividualEntityRepository;

import java.time.LocalDateTime;

/**
 * @author Nikidzawa
 */
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PACKAGE, makeFinal = true)
public class KafkaConsumerService {

    IndividualEntityRepository individualEntityRepository;

    @KafkaListener(topics = "logout-topic", groupId = "user")
    public void listen(String userId) {
        individualEntityRepository.findById(Long.valueOf(userId)).ifPresent(individualEntity -> {
           individualEntity.setLastOnline(LocalDateTime.now());
           individualEntityRepository.saveAndFlush(individualEntity);
        });
    }
}
