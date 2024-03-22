package com.alukianov.server.utils;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {
    private final JavaMailSender emailSender;
    private final TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    public String from;

    @Override
    public void sendSimpleMessage(SimpleMessage simpleMessage) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(simpleMessage.to());
        message.setSubject(simpleMessage.subject());
        message.setText(simpleMessage.text());
        emailSender.send(message);
        log.info("Sending simple email to: {}", simpleMessage.to());
    }

    @Override
    public void sendMimeMessage(SimpleMessage simpleMessage, Context context) throws MessagingException {
        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, "UTF-8");
        message.setFrom(from);

        helper.setTo(simpleMessage.to());
        helper.setSubject(simpleMessage.subject());
        String templateMessage = templateEngine.process("email", context);
        helper.setText(templateMessage, true);

        emailSender.send(message);
        log.info("Sending mime email to: {}", simpleMessage.to());
    }

}
