package ru.nikidzawa.db.store.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.nikidzawa.db.store.entity.MessageEntity;

@Repository
public interface MessageEntityRepository extends JpaRepository<MessageEntity, Long> {

}
