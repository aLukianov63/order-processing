package com.alukianov.server.security;

import lombok.Builder;

@Builder
public record LoginRequest(
        String username,
        String password
) {
}