package com.example.server.controller;

import com.example.server.dto.GetResponseDTO;
import com.example.server.dto.SearchPerformanceDTO;
import com.example.server.entity.User;
import com.example.server.repository.UserRepository;
import com.example.server.service.SearchEngineService;
import com.example.server.utils.ResponseUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class SearchEngineController {

    @Autowired
    SearchEngineService searchEngineService;

    @Autowired
    UserRepository userRepository;

    @GetMapping("/search-performance")
    public ResponseEntity<GetResponseDTO<List<SearchPerformanceDTO>>> getSearchPerformance(@RequestParam("search-term") String searchTerm, Authentication authentication) {
        String userName = authentication.getName();
        Optional<User> user = userRepository.findByUserName(userName);
        if(user.isEmpty()) return ResponseUtils.buildGetResponse(HttpStatus.NOT_FOUND, "User Not Found.", null);
        return searchEngineService.getPerformanceData(searchTerm, userName);
    }

}
