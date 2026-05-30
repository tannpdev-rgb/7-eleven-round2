package com.tannpdev.backend.common.api;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommonResult<T> {
    private long code;
    private String message;
    private T data;

    public static <T> CommonResult<T> success(T data) {
        return new CommonResult<T>(200, "success", data);
    }
    public static <T> CommonResult<T> created(T data) {
        return new CommonResult<T>(201, "created", data);
    }

    public static <T> CommonResult<T> failed(String message) {
        return new CommonResult<T>(500, message, null);
    }

    public static <T> CommonResult<T> failed(int code, String message) {
        return new CommonResult<T>(code, message, null);
    }

    public static <T> CommonResult<T> notFound() {
        return new CommonResult<T>(ResultCode.NOT_FOUND.getCode(), ResultCode.NOT_FOUND.getMessage(), null);
    }

    public static <T> CommonResult<T> validateFailed(T data) {
        return new CommonResult<>(ResultCode.VALIDATE_FAILED.getCode(), ResultCode.VALIDATE_FAILED.getMessage(), data);
    }
}
