package com.alukianov.server.exception;

public class QuantityMissingException extends RuntimeException {
    public QuantityMissingException(String message) {
        super(message);
    }
}
