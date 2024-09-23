package com.example.server.service;

import com.example.server.config.JwtService;
import com.example.server.dto.JwtRequest;
import com.example.server.dto.JwtResponse;
import com.example.server.dto.PostResponseDTO;
import com.example.server.entity.User;
import com.example.server.repository.UserRepository;
import com.example.server.utils.ResponseUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager manager;

    @Autowired
    private JwtService helper;

    public ResponseEntity<PostResponseDTO> register(User currUser) {
        try {
            User user = User.builder().password(passwordEncoder.encode(currUser.getPassword()))
                    .userName(currUser.getUserName())
                    .documents(currUser.getDocuments())
                    .build();
            userRepository.save(user);
            return ResponseUtils.buildPostResponse(HttpStatus.OK, "Created User Successfully!");
        } catch (Exception e) {
            return ResponseUtils.buildPostResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to Create User!");
        }
    }

    public ResponseEntity<JwtResponse> login(JwtRequest jwtRequest) {
        Authentication authentication = manager.authenticate(new UsernamePasswordAuthenticationToken(jwtRequest.getUserName(), jwtRequest.getPassword()));
        if (authentication.isAuthenticated()) {
            String token = helper.generateToken(jwtRequest.getUserName());
            JwtResponse response = JwtResponse.builder()
                    .jwtToken(token)
                    .userName(jwtRequest.getUserName()).build();
            return new ResponseEntity<>(response, HttpStatus.OK);

        } else {
            throw new UsernameNotFoundException("Invalid user request !");
        }
    }
}
