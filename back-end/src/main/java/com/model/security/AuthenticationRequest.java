package com.model.security;

import java.io.Serializable;

public class AuthenticationRequest implements Serializable {
    private String username;
    private String password;
    private String role;  // Roles: admin, demo, stream, studio

    public AuthenticationRequest(String username, String password, String role) {
        this.setUsername(username);
        this.setPassword(password);
        this.setRole(role);
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
