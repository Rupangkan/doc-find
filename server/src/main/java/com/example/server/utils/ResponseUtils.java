package com.example.server.utils;

import com.example.server.dto.GetResponseDTO;
import com.example.server.dto.PostResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class ResponseUtils {
    public static ResponseEntity<PostResponseDTO> buildPostResponse(HttpStatus status, String message) {
        PostResponseDTO responseDTO = PostResponseDTO.builder()
                .message(message)
                .httpStatus(status)
                .code(status.value())
                .build();
        return ResponseEntity.status(status).body(responseDTO);
    }

    public static <T> ResponseEntity<GetResponseDTO<T>> buildGetResponse(HttpStatus status, String message, T data) {
        GetResponseDTO<T> responseDTO = GetResponseDTO.<T>builder()
                .message(message)
                .httpStatus(status)
                .code(status.value())
                .data(data)
                .build();
        return ResponseEntity.status(status).body(responseDTO);
    }
}