package com.example.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SearchPerformanceDTO {
    private String algorithmName;
    private boolean isFound;
    private long executionTime;
}