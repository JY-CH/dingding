package com.ssafy.ddingga.global.error.exception;

public class UserAlreadyDeletedException extends RuntimeException {
    public UserAlreadyDeletedException(String message) {
        super(message);
    }
}
