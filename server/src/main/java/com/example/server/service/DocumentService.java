package com.example.server.service;

import com.example.server.entity.Document;
import com.example.server.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@Service
public class DocumentService {
    @Autowired
    DocumentRepository documentRepository;

    public String saveDocument(MultipartFile file, String userName){
        try {
            Document document = Document.builder()
                    .documentName(file.getOriginalFilename())
                    .userName(userName)
                    .content(new String(file.getBytes())).build();

            documentRepository.save(document);
            return document.getDocumentName();
        } catch (IOException e) {
            throw new RuntimeException("Failed to save document content.", e);
        }
    }
}
