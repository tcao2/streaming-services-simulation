package com.model.security;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class MyUserDetailService implements UserDetailsService {

    @Override
    public UserDetails loadUserByUsername(String user) throws UsernameNotFoundException {

        return new User(user, "password",
                new ArrayList<>());
    }

    public class UserNotActivatedException extends AuthenticationException {

        private static final long serialVersionUID = -1126699074574529145L;

        public UserNotActivatedException(String message) {
            super(message);
        }
    }
}
