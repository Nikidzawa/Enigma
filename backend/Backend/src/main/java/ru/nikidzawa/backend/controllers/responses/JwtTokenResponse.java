package ru.nikidzawa.backend.controllers.responses;

import lombok.Builder;
import lombok.Data;
import ru.nikidzawa.backend.store.entity.IndividualEntity;

@Data
@Builder
public class JwtTokenResponse {
    IndividualEntity user;
    String token;
}
