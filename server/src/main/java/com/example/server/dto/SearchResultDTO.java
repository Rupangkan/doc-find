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
    private List<Integer> occurrences = new ArrayList<>();

    public void addOccurrences(int startInd) {
        occurrences.add(startInd);
    }
}
