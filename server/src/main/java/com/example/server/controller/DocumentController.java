package com.example.server.controller;

import com.example.server.dto.ResponseDTO;
import com.example.server.entity.User;
import com.example.server.repository.UserRepository;
import com.example.server.service.DocumentService;
import com.example.server.utils.ResponseUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
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
    public ResponseEntity<ResponseDTO> uploadDocuments(@RequestParam("files") List<MultipartFile> files, Authentication authentication) {
        String userName = authentication.getName();
        Optional<User> user = userRepository.findByUserName(userName);
        if(user.isEmpty()) return ResponseUtils.buildResponse(HttpStatus.NOT_FOUND, "User Not Found.");
        try {
            List<String> fileNames = files.stream()
                    .map(file -> documentService.saveDocument(file, userName))
                    .toList();

            return ResponseUtils.buildResponse(HttpStatus.OK, "Uploaded file for " + userName + " " + String.join(",", fileNames));
        } catch (Exception e) {
            return ResponseUtils.buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to upload documents.");
        }
    }
}
