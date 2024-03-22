package com.alukianov.server.utils;

import jakarta.mail.MessagingException;
import org.thymeleaf.context.Context;

public interface EmailService {
    void sendSimpleMessage(SimpleMessage simpleMessage);

    void sendMimeMessage(SimpleMessage simpleMessage, Context context) throws MessagingException;
}
