package com.example.server.controller;

import com.example.server.dto.ResponseDTO;
import com.example.server.entity.User;
import com.example.server.repository.UserRepository;
import com.example.server.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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
        if(user.isEmpty()) throw new UsernameNotFoundException("User not found!");
        try {
            List<String> fileNames = files.stream()
                    .map(file -> documentService.saveDocument(file, userName))
                    .toList();

            return ResponseEntity.ok().body(
                    new ResponseDTO("Uploaded file for " + userName + " " + String.join(",", fileNames),
                    HttpStatus.OK.value(),
                    HttpStatus.OK));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseDTO.builder()
                            .message("Failed to upload documents.")
                            .code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .httpStatus(HttpStatus.INTERNAL_SERVER_ERROR)
                            .build()
            );
        }
    }
}
