package com.example.server.controller;

import com.example.server.dto.GetResponseDTO;
import com.example.server.dto.PostResponseDTO;
import com.example.server.entity.Document;
import com.example.server.entity.User;
import com.example.server.repository.UserRepository;
import com.example.server.service.DocumentService;
import com.example.server.utils.ResponseUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class DocumentController {

    @Autowired
    DocumentService documentService;

    @Autowired
    UserRepository userRepository;

    @PostMapping("/upload-documents")
    public ResponseEntity<PostResponseDTO> uploadDocuments(@RequestParam("files") List<MultipartFile> files, Authentication authentication) {
        String userName = authentication.getName();
        Optional<User> user = userRepository.findByUserName(userName);
        if(user.isEmpty()) return ResponseUtils.buildPostResponse(HttpStatus.NOT_FOUND, "User Not Found.");
        try {
            List<String> fileNames = files.stream()
                    .map(file -> documentService.saveDocument(file, userName, user.get()))
                    .toList();

            return ResponseUtils.buildPostResponse(HttpStatus.OK, "Uploaded file for " + userName + " " + String.join(", ", fileNames));
        } catch (Exception e) {
            return ResponseUtils.buildPostResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to upload documents.");
        }
    }

    @PostMapping("/delete-documents")
    public ResponseEntity<PostResponseDTO> deleteDocuments(Authentication authentication) {
        String userName = authentication.getName();
        Optional<User> user = userRepository.findByUserName(userName);
        if(user.isEmpty()) return ResponseUtils.buildPostResponse(HttpStatus.NOT_FOUND, "User Not Found.");
        return documentService.deleteDocument(userName);
    }

    @GetMapping("/get-documents")
    public ResponseEntity<GetResponseDTO<List<Document>>> getDocuments(Authentication authentication) {
        String userName = authentication.getName();
        Optional<User> user = userRepository.findByUserName(userName);
        if(user.isEmpty()) return ResponseUtils.buildGetResponse(HttpStatus.NOT_FOUND, "User Not Found.", null);
        return documentService.getDocuments(userName);
    }
}
