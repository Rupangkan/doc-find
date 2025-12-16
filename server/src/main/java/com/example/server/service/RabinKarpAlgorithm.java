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

        int n = haystack.length();
        int m = needle.length();
        if (m > n) return searchResult;

        final long base = 256;
        final long mod = 1_000_000_007L;

        // precompute base^(m-1) % mod
        long power = 1;
        for (int i = 0; i < m - 1; i++) {
            power = (power * base) % mod;
        }

        long needleHash = 0;
        long windowHash = 0;
        for (int i = 0; i < m; i++) {
            needleHash = (needleHash * base + needle.charAt(i)) % mod;
            windowHash = (windowHash * base + haystack.charAt(i)) % mod;
        }

        for (int i = 0; i <= n - m; i++) {
            if (needleHash == windowHash) {
                // possible match, verify to avoid false positive
                if (haystack.regionMatches(i, needle, 0, m)) {
                    searchResult.addOccurrences(i);
                }
            }
            if (i < n - m) {
                long left = (haystack.charAt(i) * power) % mod;
                windowHash = (windowHash + mod - left) % mod;
                windowHash = (windowHash * base + haystack.charAt(i + m)) % mod;
            }
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
