package com.example.server.service;

import com.example.server.dto.GetResponseDTO;
import com.example.server.dto.PostResponseDTO;
import com.example.server.entity.Document;
import com.example.server.entity.User;
import com.example.server.repository.DocumentRepository;
import com.example.server.utils.ResponseUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class DocumentService {
    @Autowired
    DocumentRepository documentRepository;

    public String saveDocument(MultipartFile file, String userName, User user){
        try {
            Document document = Document.builder()
                    .documentName(file.getOriginalFilename())
                    .userName(userName)
                    .user(user)
                    .content(new String(file.getBytes())).build();

            documentRepository.save(document);
            return document.getDocumentName();
        } catch (IOException e) {
            throw new RuntimeException("Failed to save document content.", e);
        }
    }

    public ResponseEntity<PostResponseDTO> deleteDocument(String userName) {
        Optional<List<Document>> documents = documentRepository.findAllByUserName(userName);
        if(documents.isEmpty()) return ResponseUtils.buildPostResponse(HttpStatus.NOT_FOUND, "No Document to delete.");
        try {
            for(Document document: documents.get()) {
                documentRepository.delete(document);
            }
            return ResponseUtils.buildPostResponse(HttpStatus.OK, "Deleted Documents Successfully.");
        } catch (Exception e) {
            return ResponseUtils.buildPostResponse(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    public ResponseEntity<GetResponseDTO<List<Document>>> getDocuments(String userName) {
        Optional<List<Document>> documents = documentRepository.findAllByUserName(userName);
        if(documents.isEmpty()) return ResponseUtils.buildGetResponse(HttpStatus.NOT_FOUND, "Something went wrong while finding documents.", null);
        else if(documents.get().isEmpty()) return ResponseUtils.buildGetResponse(HttpStatus.NOT_FOUND, "No document Available", Collections.emptyList());
        return ResponseUtils.buildGetResponse(HttpStatus.OK, "", documents.get());
    }
}
