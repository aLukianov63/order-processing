package com.alukianov.server.utils;

import lombok.Builder;

@Builder
public record ServerResponse(
        Integer status,
        String message,
        Object payload
) {
}