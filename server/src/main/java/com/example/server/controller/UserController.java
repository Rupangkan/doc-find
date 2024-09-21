package com.example.server.controller;

import com.example.server.dto.JwtRequest;
import com.example.server.dto.JwtResponse;
import com.example.server.dto.ResponseDTO;
import com.example.server.entity.User;
import com.example.server.repository.UserRepository;
import com.example.server.service.UserService;
import com.example.server.utils.ResponseUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class UserController {
    @Autowired
    UserRepository userRepository;

    @Autowired
    UserService userService;

    @PostMapping("/register")
    public ResponseEntity<ResponseDTO> register(@Valid @RequestBody User currUser) {
        Optional<User> user = userRepository.findByUserName(currUser.getUserName());
        if(user.isPresent()) return ResponseUtils.buildResponse(HttpStatus.CONFLICT, "There is already a user with this username");
        return userService.register(currUser);
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody JwtRequest jwtRequest) {
        return userService.login(jwtRequest);
    }
}
