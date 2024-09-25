package com.example.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SearchPerformanceDTO {
    private String algorithmName;
    private boolean isFound;
    private long executionTime;
    List<SearchResultDTO> searchResultDTO;
}