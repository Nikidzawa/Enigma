package ru.nikidzawa.db.store.repository;

import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ru.nikidzawa.db.store.entity.IndividualEntity;

import java.util.List;
import java.util.Optional;

@Repository
public interface IndividualEntityRepository extends JpaRepository<IndividualEntity, Long> {
    @Query("SELECT u FROM individual u WHERE (u.email = :nicknameOrEmail OR u.nickname = :nicknameOrEmail) and u.password = :password")
    Optional<IndividualEntity> findFirstByEmailOrNicknameAndPassword(@Param("nicknameOrEmail") String nicknameOrEmail,
                                                                     @Param("password") String password);
    Optional<IndividualEntity> findFirstByNickname(String nickname);

    Boolean existsByEmail(String email);

    Optional<IndividualEntity> findFirstByNicknameAndIdNot(String nickname, Long id);

    @Query("SELECT u FROM individual u WHERE LOWER(u.nickname) LIKE LOWER(CONCAT('%', :value, '%')) and u.id != :userId")
    List<IndividualEntity> search(@Param("value") String value, @Param("userId") Long userId);
}
