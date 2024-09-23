package com.example.server.service;

import com.example.server.entity.Document;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RabinKarpAlgorithm implements SearchAlgorithm {
    @Override
    public List<Document> execute(String searchTerm, String username) {
        return null;
    }
}
