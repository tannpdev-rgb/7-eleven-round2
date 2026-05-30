package com.tannpdev.backend.exception;

import com.tannpdev.backend.common.api.CommonResult;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.List;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .toList();
        return ResponseEntity.badRequest()
                .body(CommonResult.validateFailed(errors));
    }
    @ExceptionHandler(value = BindException.class)
    public ResponseEntity<Object> handleBindException(BindException ex) {
        List<String> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .toList();
        return ResponseEntity.badRequest()
                .body(CommonResult.validateFailed(errors));
    }

    @ExceptionHandler(value = HttpMessageNotReadableException.class)
    public ResponseEntity<Object> handleHttpMessageNotReadableException(HttpMessageNotReadableException ex) {
        return ResponseEntity.badRequest()
                .body(CommonResult.validateFailed("Dữ liệu gửi lên không hợp lệ"));
    }

    @ExceptionHandler(value = ApiException.class)
    public ResponseEntity<Object> handleApiException(ApiException ex) {
        if (ex.getErrorCode() != null) {
            return ResponseEntity.status(ex.getErrorCode().getCode())
                    .body(CommonResult.failed(ex.getErrorCode().getCode(), ex.getMessage()));
        }
        return ResponseEntity.status(500)
                .body(CommonResult.failed(ex.getMessage()));
    }
}
