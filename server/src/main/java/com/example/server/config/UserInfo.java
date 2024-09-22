package com.example.server.config;

import com.example.server.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;

public class UserInfo implements UserDetails {
    private final String userName;
    private final String password;

    public UserInfo(User userInfo) {
        userName = userInfo.getUserName();
        password = userInfo.getPassword();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return userName;
    }

}