package com.alukianov.server.security;

import lombok.Builder;

@Builder
public record RegisterRequest(
        String username,

        String email,
        String password
) {
}