package com.alukianov.server.utils;

import lombok.Builder;

@Builder
public record SimpleMessage(
        String to,
        String subject,
        String text
) {
}
