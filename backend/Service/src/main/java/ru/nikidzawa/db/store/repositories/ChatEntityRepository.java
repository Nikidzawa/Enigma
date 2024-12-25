package ru.nikidzawa.db.store.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.nikidzawa.db.store.entities.ChatEntity;

import java.util.List;

@Repository
public interface ChatEntityRepository extends JpaRepository<ChatEntity, Long> {

}
