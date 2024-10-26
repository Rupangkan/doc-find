package com.example.server.controller;

import com.example.server.dto.GetResponseDTO;
import com.example.server.dto.PatternMatchDTO;
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

    @GetMapping("/get-all-occurrences")
    public ResponseEntity<GetResponseDTO<List<SearchPerformanceDTO>>> getAllOccurrences(@RequestParam("search-term") String searchTerm, @RequestParam("case-sensitive") boolean isCaseSensitive, Authentication authentication) {
        String userName = authentication.getName();
        Optional<User> user = userRepository.findByUserName(userName);
        if(user.isEmpty()) return ResponseUtils.buildGetResponse(HttpStatus.NOT_FOUND, "User Not Found.", null);
        return searchEngineService.getAllOccurrences(searchTerm, isCaseSensitive, userName);
    }

    @GetMapping("/get-linear-search")
    public ResponseEntity<GetResponseDTO<SearchPerformanceDTO>> getLinearSearch(@RequestParam("search-term") String searchTerm, @RequestParam("case-sensitive") boolean isCaseSensitive, Authentication authentication) {
        String userName = authentication.getName();
        Optional<User> user = userRepository.findByUserName(userName);
        if(user.isEmpty()) return ResponseUtils.buildGetResponse(HttpStatus.NOT_FOUND, "User Not Found.", null);
        return searchEngineService.getLinearSearch(searchTerm, isCaseSensitive, userName);
    }

    @GetMapping("/get-boyer-moore-search")
    public ResponseEntity<GetResponseDTO<SearchPerformanceDTO>> getBoyerMooreSearch(@RequestParam("search-term") String searchTerm, @RequestParam("case-sensitive") boolean isCaseSensitive, Authentication authentication) {
        String userName = authentication.getName();
        Optional<User> user = userRepository.findByUserName(userName);
        if(user.isEmpty()) return ResponseUtils.buildGetResponse(HttpStatus.NOT_FOUND, "User Not Found.", null);
        return searchEngineService.getBoyerMooreSearch(searchTerm, isCaseSensitive, userName);
    }

    @GetMapping("/get-kmp-search")
    public ResponseEntity<GetResponseDTO<SearchPerformanceDTO>> getKmpSearch(@RequestParam("search-term") String searchTerm, @RequestParam("case-sensitive") boolean isCaseSensitive, Authentication authentication) {
        String userName = authentication.getName();
        Optional<User> user = userRepository.findByUserName(userName);
        if(user.isEmpty()) return ResponseUtils.buildGetResponse(HttpStatus.NOT_FOUND, "User Not Found.", null);
        return searchEngineService.getKmpSearch(searchTerm, isCaseSensitive, userName);
    }

    @GetMapping("/get-rabin-karp-search")
    public ResponseEntity<GetResponseDTO<SearchPerformanceDTO>> getRabinKarpSearch(@RequestParam("search-term") String searchTerm, @RequestParam("case-sensitive") boolean isCaseSensitive, Authentication authentication) {
        String userName = authentication.getName();
        Optional<User> user = userRepository.findByUserName(userName);
        if(user.isEmpty()) return ResponseUtils.buildGetResponse(HttpStatus.NOT_FOUND, "User Not Found.", null);
        return searchEngineService.getRabinKarpSearch(searchTerm, isCaseSensitive, userName);
    }

    @GetMapping("/get-fuzzy-search")
    public ResponseEntity<GetResponseDTO<List<PatternMatchDTO>>> getFuzzySearch(@RequestParam("search-term") String searchTerm, Authentication authentication) {
        String userName = authentication.getName();
        Optional<User> user = userRepository.findByUserName(userName);
        if(user.isEmpty()) return ResponseUtils.buildGetResponse(HttpStatus.NOT_FOUND, "User Not Found.", null);
        return searchEngineService.getFuzzySearch(searchTerm, userName);
    }
}
