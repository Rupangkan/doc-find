package com.example.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatternMatchDTO {
    private String documentName;
    private List<String> matches = new ArrayList<>();

    public void addMatches(String match) { matches.add(match); }
}
