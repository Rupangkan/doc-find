package com.example.server.service;

import com.example.server.dto.SearchResultDTO;

import java.util.List;

public interface SearchAlgorithm {
    List<SearchResultDTO> execute(String searchTerm, Boolean isCaseSensitive, String username);
}
