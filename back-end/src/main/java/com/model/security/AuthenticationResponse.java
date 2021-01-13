package com.model.security;

import java.io.Serializable;

public class AuthenticationResponse implements Serializable {

    private final String jwt;
    private final String username;

    public AuthenticationResponse(String jwt, String username) {
        this.jwt = jwt;
        this.username = username;
    }

    public String getJwt() {
        return jwt;
    }

    public String getUsername() {
        return username;
    }
}

