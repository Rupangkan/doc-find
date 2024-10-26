package com.example.server.service;

import com.example.server.dto.PatternMatchDTO;
import com.example.server.dto.SearchResultDTO;
import com.example.server.entity.Document;
import com.example.server.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class FuzzySearchAlgorithm implements TextCompleteAlgorithm {

    @Autowired
    DocumentRepository documentRepository;

    private static final int THRESHOLD = 2;

    private static final int MATCHES = 10;

    private PatternMatchDTO getFuzzySearchResultDTO(String searchTerm, Document document) {
        String content = document.getContent().toLowerCase();
        int patternLength = searchTerm.length();
        int contentLength = content.length();

        PatternMatchDTO searchResult = new PatternMatchDTO(document.getDocumentName(), new ArrayList<>());

        for (int i = 0; i <= contentLength - patternLength; i++) {
            String substring = content.substring(i, i + patternLength);

            if (isFuzzyMatch(searchTerm, substring)) {
                searchResult.addMatches(substring);
                if(searchResult.getMatches().size() >= MATCHES) return searchResult;
            }
        }

        return searchResult;
    }

    private boolean isFuzzyMatch(String searchTerm, String substring) {
        int editDistance = calculateEditDistanceIgnoreCase(searchTerm, substring);

        return editDistance <= THRESHOLD;
    }

    private int calculateEditDistanceIgnoreCase(String s1, String s2) {
        int len1 = s1.length();
        int len2 = s2.length();

        int[][] dp = new int[len1 + 1][len2 + 1];

        for (int i = 0; i <= len1; i++) {
            for (int j = 0; j <= len2; j++) {
                if (i == 0) {
                    dp[i][j] = j;
                } else if (j == 0) {
                    dp[i][j] = i;
                } else {
                    char c1 = Character.toLowerCase(s1.charAt(i - 1));
                    char c2 = Character.toLowerCase(s2.charAt(j - 1));

                    dp[i][j] = Math.min(dp[i - 1][j - 1] + (c1 == c2 ? 0 : 1),
                            Math.min(dp[i - 1][j] + 1,
                                    dp[i][j - 1] + 1));
                }
            }
        }

        return dp[len1][len2];
    }

    @Override
    public List<PatternMatchDTO> execute(String searchTerm, String username) {
        searchTerm = searchTerm.toLowerCase();
        Optional<List<Document>> documents = documentRepository.findAllByUserName(username);
        List<PatternMatchDTO> matchingDocuments = new ArrayList<>();

        if (documents.isPresent()) {
            for (Document document : documents.get()) {
                PatternMatchDTO resultDTO = getFuzzySearchResultDTO(searchTerm, document);

                if (!resultDTO.getMatches().isEmpty()) {
                    matchingDocuments.add(resultDTO);
                }
            }
        }

        return matchingDocuments;
    }
}
