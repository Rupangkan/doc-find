package com.example.server.service;

import com.example.server.entity.Document;
import com.example.server.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BasicSearchAlgorithm implements SearchAlgorithm {

    @Autowired
    DocumentRepository documentRepository;

    @Override
    public List<Document> execute(String searchTerm, String username) {
        Optional<List<Document>> documents = documentRepository.findAllByUserName(username);
        List<Document> matchingDocuments = new ArrayList<>();
        if(documents.isPresent()) {
            for(Document document: documents.get()) {
                String content = document.getContent();
                // contains is a linear search
                if(content.contains(searchTerm)) matchingDocuments.add(document);
            }
        }
        return matchingDocuments;
    }
}
