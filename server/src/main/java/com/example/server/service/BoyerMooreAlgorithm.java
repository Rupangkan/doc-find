package com.example.server.service;

import com.example.server.dto.SearchResultDTO;
import com.example.server.entity.Document;
import com.example.server.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BoyerMooreAlgorithm implements SearchAlgorithm {
    @Autowired
    DocumentRepository documentRepository;

    private SearchResultDTO getBoyerMooreSearchResultDTO(String searchTerm, Document document, Boolean isCaseSensitive) {
        String content = document.getContent();
        int patternLength = searchTerm.length();
        int contentLength = content.length();

        SearchResultDTO searchResult = new SearchResultDTO(document.getDocumentName(), new ArrayList<>());


        return searchResult;
    }

    @Override
    public List<SearchResultDTO> execute(String searchTerm, Boolean isCaseSensitive, String username) {
        searchTerm = (isCaseSensitive) ? searchTerm : searchTerm.toLowerCase();
        Optional<List<Document>> documents = documentRepository.findAllByUserName(username);
        List<SearchResultDTO> matchingDocuments = new ArrayList<>();
        if(documents.isPresent()) {
            for(Document document: documents.get()) {
                SearchResultDTO resultDTO = getBoyerMooreSearchResultDTO(searchTerm, document, isCaseSensitive);

                matchingDocuments.add(resultDTO);
            }
        }

        return matchingDocuments;
    }
}
