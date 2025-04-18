package ru.nikidzawa.websocketserver.services;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import ru.nikidzawa.kafka.KafkaLogoutTransferData;

/**
 * @author Nikidzawa
 */
@Service
public class KafkaProducerService {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public KafkaProducerService(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendLogoutData(KafkaLogoutTransferData data) {
        kafkaTemplate.send("logout-topic", data);
    }

}
