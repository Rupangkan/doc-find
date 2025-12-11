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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
public class DocumentController {

    @Autowired
    DocumentService documentService;

    @Autowired
    UserRepository userRepository;

    private static final List<String> ALLOWED_EXTENSIONS = List.of("pdf", "txt", "doc", "docx");
    private static final long MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

    @PostMapping("/upload-documents")
    public ResponseEntity<PostResponseDTO> uploadDocuments(
            @RequestParam("files") List<MultipartFile> files) {
        
        String userName = "default-user";
        
        try {
            // Validate input
            if (files == null || files.isEmpty()) {
                return ResponseUtils.buildPostResponse(HttpStatus.BAD_REQUEST, "No files provided for upload.");
            }

            // Validate each file
            List<String> validationErrors = files.stream()
                    .filter(file -> file.isEmpty() || file.getSize() == 0)
                    .map(file -> "File " + file.getOriginalFilename() + " is empty")
                    .collect(Collectors.toList());

            if (!validationErrors.isEmpty()) {
                return ResponseUtils.buildPostResponse(HttpStatus.BAD_REQUEST, 
                    "Validation failed: " + String.join(", ", validationErrors));
            }

            // Validate file sizes
            List<String> sizeErrors = files.stream()
                    .filter(file -> file.getSize() > MAX_FILE_SIZE)
                    .map(file -> "File " + file.getOriginalFilename() + " exceeds maximum size of 50MB")
                    .collect(Collectors.toList());

            if (!sizeErrors.isEmpty()) {
                return ResponseUtils.buildPostResponse(HttpStatus.PAYLOAD_TOO_LARGE, 
                    "File size validation failed: " + String.join(", ", sizeErrors));
            }

            // Validate file extensions
            List<String> extensionErrors = files.stream()
                    .filter(file -> {
                        String extension = getFileExtension(file.getOriginalFilename());
                        return !ALLOWED_EXTENSIONS.contains(extension.toLowerCase());
                    })
                    .map(file -> "File " + file.getOriginalFilename() + " has unsupported extension. Allowed: " + 
                               String.join(", ", ALLOWED_EXTENSIONS))
                    .collect(Collectors.toList());

            if (!extensionErrors.isEmpty()) {
                return ResponseUtils.buildPostResponse(HttpStatus.UNSUPPORTED_MEDIA_TYPE, 
                    "File type validation failed: " + String.join(", ", extensionErrors));
            }

            // Get or create user
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
            
            // Save documents
            List<String> fileNames = files.stream()
                    .map(file -> {
                        try {
                            return documentService.saveDocument(file, userName, user);
                        } catch (Exception e) {
                            throw new RuntimeException("Failed to save file " + file.getOriginalFilename() + ": " + e.getMessage());
                        }
                    })
                    .toList();


            return ResponseUtils.buildPostResponse(HttpStatus.OK, 
                "Successfully uploaded " + files.size() + " file(s) for " + userName + ": " + String.join(", ", fileNames));
                
        } catch (Exception e) {
            return ResponseUtils.buildPostResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                "Failed to upload documents: " + e.getMessage());
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

    private String getFileExtension(String filename) {
        if (filename == null || filename.isEmpty()) {
            return "";
        }
        int lastDotIndex = filename.lastIndexOf('.');
        return lastDotIndex > 0 ? filename.substring(lastDotIndex + 1) : "";

    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<PostResponseDTO> handleGenericException(Exception e) {
        return ResponseUtils.buildPostResponse(HttpStatus.INTERNAL_SERVER_ERROR, 
            "An unexpected error occurred: " + e.getMessage());
    }
}
