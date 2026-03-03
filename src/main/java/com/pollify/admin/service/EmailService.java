package com.pollify.admin.service;

import com.pollify.admin.entity.master.TenantInvitation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.internet.MimeMessage;

/**
 * Service for sending emails via SMTP using Thymeleaf templates.
 * Templates live in: src/main/resources/templates/email/
 * SMTP credentials are set via environment variables in application.yaml.
 */
@Service
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String fromAddress;

    @Value("${pollify.frontend.url:http://localhost:8080}")
    private String frontendUrl;

    public EmailService(JavaMailSender mailSender, TemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    /**
     * Send an invitation email to a school/university.
     * Uses the Thymeleaf template: templates/email/invitation.html
     *
     * @param invitation the saved TenantInvitation entity
     */
    public void sendInvitationEmail(TenantInvitation invitation) {
        String registrationLink = frontendUrl + "/register/" + invitation.getInvitationToken();
        String subject = "You're invited to join Pollify – " + invitation.getUniversityName();

        // ── Build Thymeleaf context ──────────────────────────────────────────
        Context ctx = new Context();
        ctx.setVariable("universityName",   invitation.getUniversityName());
        ctx.setVariable("registrationLink", registrationLink);
        ctx.setVariable("invitationCode",  invitation.getInvitationCode());
        ctx.setVariable("expiryDays",      7);

        // ── Render template ──────────────────────────────────────────────────
        String body = templateEngine.process("email/invitation", ctx);

        // ── Send ─────────────────────────────────────────────────────────────
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromAddress);
            helper.setTo(invitation.getUniversityEmail());
            helper.setSubject(subject);
            helper.setText(body, true); // true = HTML

            mailSender.send(message);
            log.info("Invitation email sent to: {}", invitation.getUniversityEmail());

        } catch (Exception e) {
            log.error("Failed to send invitation email to {}: {}",
                    invitation.getUniversityEmail(), e.getMessage(), e);
            throw new RuntimeException(
                    "Invitation saved but email delivery failed: " + e.getMessage(), e);
        }
    }
}
