package com.example.server.service;

import com.example.server.dto.SearchResultDTO;
import com.example.server.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FuzzySearchAlgorithm implements SearchAlgorithm {

    @Autowired
    DocumentRepository documentRepository;

    @Override
    public List<SearchResultDTO> execute(String searchTerm, Boolean isCaseSensitive, String username) {
        return null;
    }
}
