package com.example.server.controller;

import com.example.server.dto.ResponseDTO;
import com.example.server.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;

public class DocumentController {

    @Autowired
    DocumentService documentService;

    @PostMapping('/upload-document')
    public ResponseEntity<ResponseDTO> uploadDocuments(String username, )
}
