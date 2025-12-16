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
        SearchResultDTO searchResult = new SearchResultDTO(document.getDocumentName(), new ArrayList<>());

        if (searchTerm == null || searchTerm.isEmpty() || content == null || content.isEmpty()) {
            return searchResult;
        }

        String haystack = isCaseSensitive != null && isCaseSensitive ? content : content.toLowerCase();
        String needle = isCaseSensitive != null && isCaseSensitive ? searchTerm : searchTerm.toLowerCase();

        int n = haystack.length();
        int m = needle.length();
        if (m > n) return searchResult;

        // Build shift table (Horspool variant of Boyer-Moore)
        final int DEFAULT_SHIFT = m;
        java.util.Map<Character, Integer> shift = new java.util.HashMap<>();
        for (int i = 0; i < m - 1; i++) {
            shift.put(needle.charAt(i), m - 1 - i);
        }

        int i = 0;
        while (i <= n - m) {
            int j = m - 1;
            while (j >= 0 && needle.charAt(j) == haystack.charAt(i + j)) {
                j--;
            }
            if (j < 0) {
                // match at position i
                searchResult.addOccurrences(i);
                // shift by full length to find next non-overlapping or overlapping match
                i += 1; // allow overlapping matches
            } else {
                char c = haystack.charAt(i + m - 1);
                int s = shift.getOrDefault(c, DEFAULT_SHIFT);
                i += s;
            }
        }

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
