package ru.nikidzawa.db.configs.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import ru.nikidzawa.db.exceptions.UnauthorizedException;
import ru.nikidzawa.db.store.entity.IndividualEntity;
import ru.nikidzawa.db.store.repository.IndividualEntityRepository;

import java.util.Collections;
import java.util.Optional;

@Service
public class MyUserDetailService implements UserDetailsService {

    @Autowired
    private IndividualEntityRepository repository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<IndividualEntity> individualEntity = repository.findFirstByNickname(username);
        if (individualEntity.isPresent()) {
            return new User(username, individualEntity.get().getPassword(), Collections.singleton(new SimpleGrantedAuthority("USER")));
        } else throw new UnauthorizedException("Не верное имя или пароль");
    }
}
