package com.example.server.service;

import com.example.server.entity.Document;
import com.example.server.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FuzzySearchAlgorithm implements SearchAlgorithm {

    @Autowired
    DocumentRepository documentRepository;

    @Override
    public List<Document> execute(String searchTerm, String username) {
        return null;
    }
}
