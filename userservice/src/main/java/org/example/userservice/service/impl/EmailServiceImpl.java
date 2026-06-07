package org.example.userservice.service.impl;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.userservice.service.EmailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Override
    public void sendPasswordResetEmail(String toEmail, String fullName, String resetLink) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("🔐 Đặt lại mật khẩu — Anvi System");

            String htmlContent = buildEmailHtml(fullName, resetLink);
            helper.setText(htmlContent, true);

            mailSender.send(mimeMessage);
            log.info("Password reset email sent to: {}", toEmail);
        } catch (MessagingException e) {
            log.error("Failed to send password reset email to {}: {}", toEmail, e.getMessage());
            throw new RuntimeException("Không thể gửi email. Vui lòng thử lại sau.");
        }
    }

    private String buildEmailHtml(String fullName, String resetLink) {
        return """
            <!DOCTYPE html>
            <html lang="vi">
            <head>
              <meta charset="UTF-8"/>
              <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
              <title>Đặt lại mật khẩu</title>
            </head>
            <body style="margin:0;padding:0;background:#0f172a;font-family:system-ui,-apple-system,sans-serif;">
              <table width="100%%" cellpadding="0" cellspacing="0" style="background:#0f172a;min-height:100vh;">
                <tr>
                  <td align="center" style="padding:40px 20px;">
                    <table width="560" cellpadding="0" cellspacing="0" style="background:rgba(30,41,59,0.95);border-radius:24px;border:1px solid rgba(255,255,255,0.1);box-shadow:0 25px 50px rgba(0,0,0,0.5);overflow:hidden;">
                      
                      <!-- Header gradient -->
                      <tr>
                        <td style="background:linear-gradient(135deg,#6366f1,#a855f7);padding:32px 40px;text-align:center;">
                          <div style="font-size:40px;margin-bottom:8px;">🔐</div>
                          <h1 style="margin:0;color:#fff;font-size:1.6rem;font-weight:800;letter-spacing:-0.5px;">Đặt lại mật khẩu</h1>
                          <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:0.9rem;">Anvi System</p>
                        </td>
                      </tr>
                      
                      <!-- Body -->
                      <tr>
                        <td style="padding:36px 40px;">
                          <p style="margin:0 0 16px;color:#cbd5e1;font-size:1rem;">Xin chào <strong style="color:#c084fc;">%s</strong>,</p>
                          <p style="margin:0 0 24px;color:#94a3b8;font-size:0.95rem;line-height:1.6;">
                            Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn trên <strong style="color:#e2e8f0;">Anvi System</strong>. 
                            Nhấn vào nút bên dưới để tạo mật khẩu mới.
                          </p>
                          
                          <!-- CTA Button -->
                          <table width="100%%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td align="center" style="padding:8px 0 28px;">
                                <a href="%s" style="display:inline-block;padding:16px 40px;background:linear-gradient(135deg,#6366f1,#a855f7);color:#fff;text-decoration:none;border-radius:12px;font-weight:800;font-size:1rem;letter-spacing:0.5px;box-shadow:0 8px 20px rgba(168,85,247,0.4);">
                                  ĐẶT LẠI MẬT KHẨU
                                </a>
                              </td>
                            </tr>
                          </table>
                          
                          <!-- Warning box -->
                          <div style="background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.3);border-radius:12px;padding:16px 20px;margin-bottom:24px;">
                            <p style="margin:0;color:#fbbf24;font-size:0.875rem;line-height:1.5;">
                              ⏰ <strong>Lưu ý:</strong> Link này chỉ có hiệu lực trong <strong>15 phút</strong>. 
                              Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.
                            </p>
                          </div>
                          
                          <!-- Fallback link -->
                          <p style="margin:0;color:#64748b;font-size:0.8rem;word-break:break-all;">
                            Nếu nút không hoạt động, copy link sau vào trình duyệt:<br/>
                            <a href="%s" style="color:#8b5cf6;">%s</a>
                          </p>
                        </td>
                      </tr>
                      
                      <!-- Footer -->
                      <tr>
                        <td style="background:rgba(15,23,42,0.5);padding:20px 40px;text-align:center;border-top:1px solid rgba(255,255,255,0.05);">
                          <p style="margin:0;color:#475569;font-size:0.8rem;">
                            © 2025 Anvi System · Nếu cần hỗ trợ, vui lòng liên hệ đội ngũ của chúng tôi.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
            """.formatted(fullName, resetLink, resetLink, resetLink);
    }
}
