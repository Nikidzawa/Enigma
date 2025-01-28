package ru.nikidzawa.db.controllers.responses;

import lombok.Builder;
import lombok.Data;
import ru.nikidzawa.db.store.entity.IndividualEntity;

@Data
@Builder
public class JwtTokenResponse {
    IndividualEntity user;
    String token;
}
