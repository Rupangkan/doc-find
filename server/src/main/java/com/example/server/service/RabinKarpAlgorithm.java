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
public class RabinKarpAlgorithm implements SearchAlgorithm {

    @Autowired
    DocumentRepository documentRepository;

    private SearchResultDTO getRabinKarpSearchResultDTO(String searchTerm, Document document, Boolean isCaseSensitive) {
        String content = document.getContent();
        SearchResultDTO searchResult = new SearchResultDTO(document.getDocumentName(), new ArrayList<>());

        if (searchTerm == null || searchTerm.isEmpty() || content == null || content.isEmpty()) {
            return searchResult;
        }

        String haystack = isCaseSensitive != null && isCaseSensitive ? content : content.toLowerCase();
        String needle = isCaseSensitive != null && isCaseSensitive ? searchTerm : searchTerm.toLowerCase();

        int index = haystack.indexOf(needle, 0);
        while (index >= 0) {
            searchResult.addOccurrences(index);
            index = haystack.indexOf(needle, index + 1);
        }

        return searchResult;
    }

    @Override
    public List<SearchResultDTO> execute(String searchTerm,Boolean isCaseSensitive,  String username) {
        searchTerm = (isCaseSensitive) ? searchTerm : searchTerm.toLowerCase();
        Optional<List<Document>> documents = documentRepository.findAllByUserName(username);
        List<SearchResultDTO> matchingDocuments = new ArrayList<>();
        if(documents.isPresent()) {
            for(Document document: documents.get()) {
                SearchResultDTO resultDTO = getRabinKarpSearchResultDTO(searchTerm, document, isCaseSensitive);

                matchingDocuments.add(resultDTO);
            }
        }

        return matchingDocuments;
    }
}
