package com.example.server.exception;

import com.example.server.dto.ResponseDTO;
import com.example.server.utils.ResponseUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

@ControllerAdvice
public class FileUploadExceptionAdvice {
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ResponseDTO> handleMaxSizeException(MaxUploadSizeExceededException exc) {
        return ResponseUtils.buildResponse(HttpStatus.PAYLOAD_TOO_LARGE, "File size exceeds the limit! Please upload a file smaller than the allowed size.");
    }
}
