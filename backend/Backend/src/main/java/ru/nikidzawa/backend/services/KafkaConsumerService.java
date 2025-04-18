package ru.nikidzawa.backend.services;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import ru.nikidzawa.backend.store.entity.IndividualEntity;
import ru.nikidzawa.kafka.KafkaLogoutTransferData;

/**
 * @author Nikidzawa
 */
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PACKAGE, makeFinal = true)
public class KafkaConsumerService {

    IndividualEntityService individualEntityService;

    @KafkaListener(topics = "logout-topic", groupId = "user")
    public void logoutTopicListener(KafkaLogoutTransferData data) {
        IndividualEntity individual = individualEntityService.findById(data.getUserId());
        individual.setLastLogoutDate(data.getLastLogoutDate());
        individualEntityService.update(individual);
    }

}
