package com.tannpdev.backend.common.api;

public enum ResultCode implements IErrorCode {
    SUCCESS(200, "OK"),
    FAILED(500, "Internal Server Error"),
    NOT_FOUND(404, "Not Found"),
    UNAUTHORIZED(401, "Unauthorized"),
    FORBIDDEN(403, "Forbidden"),
    VALIDATE_FAILED(400, "Validation Failed");
    

    private final int code;
    private final String message;

    ResultCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    @Override
    public int getCode() {
        return code;
    }

    @Override
    public String getMessage() {
        return message;
    }
}
