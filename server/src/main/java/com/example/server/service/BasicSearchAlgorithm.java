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
public class BasicSearchAlgorithm implements SearchAlgorithm {

    @Autowired
    DocumentRepository documentRepository;

    @Override
    public List<SearchResultDTO> execute(String searchTerm, Boolean isCaseSensitive, String username) {
        Optional<List<Document>> documents = documentRepository.findAllByUserName(username);
        List<SearchResultDTO> matchingDocuments = new ArrayList<>();
        if(documents.isPresent()) {
            for(Document document: documents.get()) {
                SearchResultDTO resultDTO = getSearchResultDTO(searchTerm, isCaseSensitive, document);

                matchingDocuments.add(resultDTO);
            }
        }

        return matchingDocuments;
    }

    private static SearchResultDTO getSearchResultDTO(String searchTerm, Boolean isCaseSensitive, Document document) {
        String content = document.getContent();
        SearchResultDTO resultDTO = new SearchResultDTO(document.getDocumentName(), new ArrayList<>());
        int contentLength = content.length();

        for(int startIndex = 0; startIndex <= contentLength - searchTerm.length(); startIndex++) {
            int currSearchSize = startIndex + searchTerm.length();

            for(int endIndex = startIndex+1; endIndex < currSearchSize; endIndex++) {
                String substring = content.substring(startIndex, endIndex + 1);

                boolean isMatch = (isCaseSensitive != null && isCaseSensitive)
                        ? substring.equals(searchTerm)
                        : substring.equalsIgnoreCase(searchTerm);

                if(isMatch) resultDTO.addOccurrences(startIndex);
            }
        }

        return resultDTO;
    }
}
