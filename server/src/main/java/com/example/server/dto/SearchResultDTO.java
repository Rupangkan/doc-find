package com.example.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchResultDTO {
    private String documentName;
    private List<int[]> occurrences = new ArrayList<>();

    public void addOccurrences(int startInd, int endInd) {
        occurrences.add(new int[] { startInd, endInd });
    }
}
