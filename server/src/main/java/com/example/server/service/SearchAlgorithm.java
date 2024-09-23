package com.example.server.service;

import com.example.server.entity.Document;
import java.util.List;

public interface SearchAlgorithm {
    List<Document> execute(String searchTerm, String username);
}
