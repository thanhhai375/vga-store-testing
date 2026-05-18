package com.example.vgashop.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.vgashop.repository.ApiResponse;


@RestControllerAdvice
public class GlobalExceptionHandler {

    // Process

    // @ExceptionHandler(
    //     ResourceNotFoundException.class
    // )
    // public ResponseEntity<ApiError> handleNotFound(ResourceNotFoundException ex) {
    //     ApiError error = new ApiError(HttpStatus.NOT_FOUND.value(), "Not Found", ex.getMessage());

    //     return new ResponseEntity<> (
    //         error,
    //         HttpStatus.NOT_FOUND
    //     );
    // }


    @ExceptionHandler(
        ResourceNotFoundException.class
    )
    public ResponseEntity<ApiResponse<Object>> handleNotFound(ResourceNotFoundException ex) {
        ApiResponse<Object> response = ApiResponse.error(ex.getMessage());

        return new ResponseEntity<> (
            response,
            HttpStatus.NOT_FOUND
        );
    }

    // Process
    // @ExceptionHandler(
    //     DuplicateResourceException.class
    // )
    // public ResponseEntity<ApiError> handleDuplicate(DuplicateResourceException ex) {
    //     ApiError error = new ApiError(HttpStatus.CONFLICT.value(),"Conflict", ex.getMessage());

    //     return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    // }


    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiResponse<Object>> handleDuplicateResource(DuplicateResourceException ex) {
        ApiResponse<Object> response = ApiResponse.error(ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    // Business rule violations (e.g. tự khóa/xóa chính mình, khóa/xóa admin)
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ApiResponse<Object>> handleIllegalState(IllegalStateException ex) {
        ApiResponse<Object> response = ApiResponse.error(ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Object>> handleIllegalArgument(IllegalArgumentException ex) {
        ApiResponse<Object> response = ApiResponse.error(ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

     // Process
    //  @ExceptionHandler(MethodArgumentNotValidException.class)
    //  public ResponseEntity<Object> handleValidation(MethodArgumentNotValidException ex) {
    //     Map<String, String> errors = new HashMap<>();

    //     ex.getBindingResult()
    //              .getFieldErrors()
    //              .forEach(error ->
    //                 errors.put(error.getField(), error.getDefaultMessage())
    //              );
        

    //     ApiError apiError = new ApiError(
    //         HttpStatus.BAD_REQUEST.value(),
    //         "Validation Failed",

    //     );

    // Error handling
    //     Map<String, Object> response = new HashMap<>();
    //     response.put("Status", apiError.getStatus());
    //     response.put("error", apiError.getError());
    //     response.put("message", apiError.getMessage());
    //     response.put("timestamp", apiError.getTimestamp());
    // Error handling
    //     // return new ResponseEntity<> (errors, HttpStatus.BAD_REQUEST);
    //     return new ResponseEntity<> (response, HttpStatus.BAD_REQUEST);
    // }


    @ExceptionHandler(MethodArgumentNotValidException.class)
     public ResponseEntity<ApiResponse<Object>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult()
                 .getFieldErrors()
                 .forEach(error ->
                    errors.put(error.getField(), error.getDefaultMessage())
                 );
        

        ApiResponse<Object> response = new ApiResponse<>(
            false,
            "Dữ liệu không hợp lệ",
            errors
        );
        return new ResponseEntity<> (response, HttpStatus.BAD_REQUEST);
    }

    // Retrieve all
    // @ExceptionHandler(Exception.class)
    // public ResponseEntity<ApiError> handleGeneral(Exception ex) {
    //     ApiError error = new ApiError(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal Server Error",
    // Error handling

    // Error handling
    //     ex.printStackTrace();
    //     return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    // }


    // DB constraint violations (nullable=false, unique key, etc.)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Object>> handleDataIntegrity(DataIntegrityViolationException ex) {
        String msg = ex.getRootCause() != null ? ex.getRootCause().getMessage() : ex.getMessage();
        ApiResponse<Object> response = ApiResponse.error("Lỗi ràng buộc dữ liệu: " + msg);
        ex.printStackTrace();
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGeneral(Exception ex) {
        String errMsg = ex.getMessage() != null ? ex.getMessage() : "Đã xảy ra lỗi hệ thống";
        ApiResponse<Object> response = ApiResponse.error("Lỗi hệ thống: " + errMsg);
        ex.printStackTrace();
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
