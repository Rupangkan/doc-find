package com.example.server.service;

import com.example.server.dto.SearchResultDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KnuthMorrisPrattAlgorithm implements SearchAlgorithm {
    @Override
    public List<SearchResultDTO> execute(String searchTerm, Boolean isCaseSensitive, String username) {
        return null;
    }
}
