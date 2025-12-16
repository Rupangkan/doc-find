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
public class FuzzySearchAlgorithm implements SearchAlgorithm {

    @Autowired
    DocumentRepository documentRepository;

    private SearchResultDTO getFuzzySearchResultDTO(String searchTerm, Document document, Boolean isCaseSensitive) {
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

        // threshold for fuzzy match: allow up to maxDistance edits
        int maxDistance = Math.max(1, m / 4); // heuristic: 25% of pattern length, at least 1

        for (int i = 0; i <= n - m; i++) {
            String window = haystack.substring(i, i + m);
            if (window.equals(needle)) {
                searchResult.addOccurrences(i);
            } else {
                int dist = levenshteinDistance(window, needle, maxDistance);
                if (dist <= maxDistance) {
                    searchResult.addOccurrences(i);
                }
            }
        }

        return searchResult;
    }

    // compute Levenshtein distance with early exit when exceeding maxDistance
    private int levenshteinDistance(String a, String b, int maxDistance) {
        int n = a.length();
        int m = b.length();
        int[] prev = new int[m + 1];
        int[] curr = new int[m + 1];

        for (int j = 0; j <= m; j++) prev[j] = j;

        for (int i = 1; i <= n; i++) {
            curr[0] = i;
            int minRow = curr[0];
            for (int j = 1; j <= m; j++) {
                int cost = a.charAt(i - 1) == b.charAt(j - 1) ? 0 : 1;
                curr[j] = Math.min(Math.min(curr[j - 1] + 1, prev[j] + 1), prev[j - 1] + cost);
                minRow = Math.min(minRow, curr[j]);
            }
            if (minRow > maxDistance) return maxDistance + 1; // early exit
            int[] tmp = prev; prev = curr; curr = tmp;
        }
        return prev[m];
    }

    @Override
    public List<SearchResultDTO> execute(String searchTerm, Boolean isCaseSensitive, String username) {
        searchTerm = (isCaseSensitive) ? searchTerm : searchTerm.toLowerCase();
        Optional<List<Document>> documents = documentRepository.findAllByUserName(username);
        List<SearchResultDTO> matchingDocuments = new ArrayList<>();
        if(documents.isPresent()) {
            for(Document document: documents.get()) {
                SearchResultDTO resultDTO = getFuzzySearchResultDTO(searchTerm, document, isCaseSensitive);

                matchingDocuments.add(resultDTO);
            }
        }

        return matchingDocuments;
    }
}
