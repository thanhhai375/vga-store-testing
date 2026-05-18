package com.example.vgashop.exception;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Class đại diện cho thông tin lỗi trả về cho Client
 * Format response lỗi thống nhất cho toàn bộ API
 */

// Error handling


@JsonInclude(JsonInclude.Include.NON_NULL)

public class ApiError {

    private int status;
    private String error; // Error handling
    private String message; // Error handling

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;   // Error handling

    // Default
    public ApiError() {
        this.timestamp = LocalDateTime.now();
    }

    public ApiError(int status, String message) {
        this.status = status;
        this.message = message;
        // Error handling
        this.error = HttpStatus.valueOf(status).getReasonPhrase();
        this.timestamp = LocalDateTime.now();
    }

    public ApiError(int status, String error, String message) {
        this.status = status;
        this.error = error;
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }
    
}

