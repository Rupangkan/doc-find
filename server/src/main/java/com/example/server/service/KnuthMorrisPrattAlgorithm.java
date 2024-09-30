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
public class KnuthMorrisPrattAlgorithm implements SearchAlgorithm {

    @Autowired
    DocumentRepository  documentRepository;

    private int[] computeLongestPrefixSuffix(String pattern) {
        int length = 0, index = 1, n = pattern.length();
        int[] lps = new int[n];

        while(index<n) {
            if(pattern.charAt(length) == pattern.charAt(index)) {
                length++;
                lps[index] = length;
                index++;
            } else {
                if(length > 0) {
                    lps[index] = lps[length-1];
                } else {
                    lps[index] = length;
                    index++;
                }
            }
        }
        return lps;
    }

    private SearchResultDTO getKmpSearchResultDTO(String searchTerm, int[] searchLpsArray, Document document, Boolean isCaseSensitive) {
        String content = document.getContent();
        int patternLength = searchTerm.length();
        int contentLength = content.length();

        SearchResultDTO searchResult = new SearchResultDTO(document.getDocumentName(), new ArrayList<>());

        int contentIndex = 0, patternIndex = 0;
        while ((contentLength - contentIndex) >= (patternLength - patternIndex)) {

            char contentChar = content.charAt(contentIndex);
            char patternChar = searchTerm.charAt(patternIndex);

            if (!isCaseSensitive) contentChar = Character.toLowerCase(contentChar);

            if (patternChar == contentChar) {
                patternIndex++;
                contentIndex++;
            }

            if (patternIndex == patternLength) {
                searchResult.addOccurrences(contentIndex - patternIndex);
                patternIndex = searchLpsArray[patternIndex - 1];
            }
            else if (contentIndex < contentLength && patternChar != contentChar) {
                if (patternIndex != 0) {
                    patternIndex = searchLpsArray[patternIndex - 1];
                } else {
                    contentIndex++;
                }
            }
        }
        return searchResult;
    }

    @Override
    public List<SearchResultDTO> execute(String searchTerm, Boolean isCaseSensitive, String username) {
        searchTerm = (isCaseSensitive) ? searchTerm : searchTerm.toLowerCase();
        int[] searchLpsArray = computeLongestPrefixSuffix(searchTerm);
        Optional<List<Document>> documents = documentRepository.findAllByUserName(username);
        List<SearchResultDTO> matchingDocuments = new ArrayList<>();
        if(documents.isPresent()) {
            for(Document document: documents.get()) {
                SearchResultDTO resultDTO = getKmpSearchResultDTO(searchTerm, searchLpsArray, document, isCaseSensitive);

                matchingDocuments.add(resultDTO);
            }
        }

        return matchingDocuments;
    }

}
