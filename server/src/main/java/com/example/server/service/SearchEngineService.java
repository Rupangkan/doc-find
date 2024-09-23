package com.example.server.service;

import com.example.server.dto.GetResponseDTO;
import com.example.server.dto.SearchPerformanceDTO;
import com.example.server.entity.Document;
import com.example.server.utils.ResponseUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
public class SearchEngineService {

    @Autowired
    List<SearchAlgorithm> searchAlgorithms;

    public ResponseEntity<GetResponseDTO<List<SearchPerformanceDTO>>> getPerformanceData(String searchTerm, String userName) {
        List<SearchPerformanceDTO> searchTimes = new ArrayList<>();
        try {
            for (SearchAlgorithm algorithm : searchAlgorithms) {
                SearchPerformanceDTO searchPerformance = measureSearchExecutionTime(searchTerm, userName, algorithm);
                searchTimes.add(searchPerformance);
            }
            return ResponseUtils.buildGetResponse(HttpStatus.OK, "Search execution times calculated successfully. ", searchTimes);
        } catch (Exception e) {
            return ResponseUtils.buildGetResponse(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), null);
        }
    }

    public SearchPerformanceDTO measureSearchExecutionTime(String searchTerm, String username, SearchAlgorithm algorithm) {
        Instant start = Instant.now();
        List<Document> results = algorithm.execute(searchTerm, username);
        boolean isFound = results != null && !results.isEmpty();
        Instant end = Instant.now();
        return new SearchPerformanceDTO(algorithm.getClass().getSimpleName(), isFound, Duration.between(start, end).toMillis());
    }
}
