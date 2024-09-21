package com.example.server.service;

import com.example.server.dto.ResponseDTO;
import com.example.server.entity.User;
import com.example.server.repository.UserRepository;
import com.example.server.utils.ResponseUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public ResponseEntity<ResponseDTO> register(User currUser) {
        try {
            User user = User.builder().password(passwordEncoder.encode(currUser.getPassword()))
                    .userName(currUser.getUserName())
                    .documents(currUser.getDocuments())
                    .build();
            userRepository.save(user);
            return ResponseUtils.buildResponse(HttpStatus.OK, "Created User Successfully!");
        } catch (Exception e) {
            return ResponseUtils.buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to Create User!");
        }
    }
}
