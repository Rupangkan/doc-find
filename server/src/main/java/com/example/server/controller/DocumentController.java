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
    public ResponseEntity<PostResponseDTO> uploadDocuments(@RequestParam("files") List<MultipartFile> files) {
        String userName = "default-user";
        try {
            Optional<User> userOptional = userRepository.findByUserName(userName);
            final User user;
            if(userOptional.isEmpty()) {
                User newUser = new User();
                newUser.setUserName(userName);
                newUser.setPassword("default");
                userRepository.save(newUser);
                user = userRepository.findByUserName(userName).get();
            } else {
                user = userOptional.get();
            }
            
            List<String> fileNames = files.stream()
                    .map(file -> documentService.saveDocument(file, userName, user))
                    .toList();

            return ResponseUtils.buildPostResponse(HttpStatus.OK, "Uploaded file for " + userName + " " + String.join(", ", fileNames));
        } catch (Exception e) {
            return ResponseUtils.buildPostResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to upload documents.");
        }
    }

    @PostMapping("/delete-documents")
    public ResponseEntity<PostResponseDTO> deleteDocuments() {
        String userName = "default-user";
        Optional<User> user = userRepository.findByUserName(userName);
        if(user.isEmpty()) return ResponseUtils.buildPostResponse(HttpStatus.NOT_FOUND, "User Not Found.");
        return documentService.deleteDocument(userName);
    }

    @GetMapping("/get-documents")
    public ResponseEntity<GetResponseDTO<List<Document>>> getDocuments() {
        String userName = "default-user";
        Optional<User> user = userRepository.findByUserName(userName);
        if(user.isEmpty()) return ResponseUtils.buildGetResponse(HttpStatus.NOT_FOUND, "User Not Found.", null);
        return documentService.getDocuments(userName);
    }
}
