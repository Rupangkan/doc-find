package com.example.server.utils;

import com.example.server.dto.ResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class ResponseUtils {
    public static ResponseEntity<ResponseDTO> buildResponse(HttpStatus status, String message) {
        ResponseDTO responseDTO = ResponseDTO.builder()
                .message(message)
                .httpStatus(status)
                .code(status.value())
                .build();
        return ResponseEntity.status(status).body(responseDTO);
    }
}