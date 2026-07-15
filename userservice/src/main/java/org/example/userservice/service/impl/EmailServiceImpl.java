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
  public void sendRegistrationLinkEmail(String toEmail, String link) {
    try {
      MimeMessage mimeMessage = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

      helper.setFrom(fromEmail);
      helper.setTo(toEmail);
      helper.setSubject("🔑 Xác thực đăng ký tài khoản — Anvi System");

      String htmlContent = buildRegistrationLinkEmailHtml(link);
      helper.setText(htmlContent, true);

      mailSender.send(mimeMessage);
      log.info("Registration link email sent to: {}", toEmail);
    } catch (MessagingException e) {
      log.error("Failed to send Registration Link email to {}: {}", toEmail, e.getMessage());
      throw new RuntimeException("Không thể gửi email xác thực. Vui lòng thử lại sau.");
    }
  }

  private String buildRegistrationLinkEmailHtml(String link) {
    return """
        <!DOCTYPE html>
        <html lang="vi">
        <head>
          <meta charset="UTF-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>Xác thực đăng ký</title>
        </head>
        <body style="margin:0;padding:0;background:#0f172a;font-family:system-ui,-apple-system,sans-serif;">
          <table width="100%%" cellpadding="0" cellspacing="0" style="background:#0f172a;min-height:100vh;">
            <tr>
              <td align="center" style="padding:40px 20px;">
                <table width="560" cellpadding="0" cellspacing="0" style="background:rgba(30,41,59,0.95);border-radius:24px;border:1px solid rgba(255,255,255,0.1);box-shadow:0 25px 50px rgba(0,0,0,0.5);overflow:hidden;">
                  
                  <!-- Header gradient -->
                  <tr>
                    <td style="background:linear-gradient(135deg,#3b82f6,#2dd4bf);padding:32px 40px;text-align:center;">
                      <div style="font-size:40px;margin-bottom:8px;">🚀</div>
                      <h1 style="margin:0;color:#fff;font-size:1.6rem;font-weight:800;letter-spacing:-0.5px;">Xác thực tài khoản</h1>
                      <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:0.9rem;">Anvi System</p>
                    </td>
                  </tr>
                  
                  <!-- Body -->
                  <tr>
                    <td style="padding:36px 40px;">
                      <p style="margin:0 0 16px;color:#cbd5e1;font-size:1rem;">Xin chào,</p>
                      <p style="margin:0 0 24px;color:#94a3b8;font-size:0.95rem;line-height:1.6;">
                        Chúng tôi nhận được yêu cầu đăng ký tài khoản bằng địa chỉ email này trên <strong style="color:#e2e8f0;">Anvi System</strong>. 
                        Vui lòng nhấn vào nút bên dưới để tiếp tục quá trình đăng ký:
                      </p>
                      
                      <!-- Link Button -->
                      <table width="100%%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding:8px 0 28px;">
                            <a href="%s" style="display:inline-block;padding:16px 40px;background:linear-gradient(135deg,#3b82f6,#2dd4bf);color:#fff;text-decoration:none;border-radius:12px;font-weight:800;font-size:1rem;letter-spacing:0.5px;box-shadow:0 8px 20px rgba(45,212,191,0.4);">
                              TIẾP TỤC ĐĂNG KÝ
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Warning box -->
                      <div style="background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.3);border-radius:12px;padding:16px 20px;margin-bottom:24px;">
                        <p style="margin:0;color:#fbbf24;font-size:0.875rem;line-height:1.5;">
                          ⏰ <strong>Lưu ý:</strong> Link này chỉ có hiệu lực trong <strong>15 phút</strong>. 
                          Nếu bạn không yêu cầu đăng ký tài khoản, hãy bỏ qua email này.
                        </p>
                      </div>
                      
                      <!-- Fallback link -->
                      <p style="margin:0;color:#64748b;font-size:0.8rem;word-break:break-all;">
                        Nếu nút không hoạt động, copy link sau vào trình duyệt:<br/>
                        <a href="%s" style="color:#2dd4bf;">%s</a>
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
        """.formatted(link, link, link);
  }

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
        """
        .formatted(fullName, resetLink, resetLink, resetLink);
  }

  @Override
  public void sendOrderSuccessEmail(String toEmail, String fullName, String orderId, String transactionNo) {
    try {
      MimeMessage mimeMessage = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

      helper.setFrom(fromEmail);
      helper.setTo(toEmail);
      helper.setSubject("✅ Thanh toán thành công — Anvi System");

      String htmlContent = buildOrderSuccessHtml(fullName, orderId, transactionNo);
      helper.setText(htmlContent, true);

      mailSender.send(mimeMessage);
      log.info("Order success email sent to: {}", toEmail);
    } catch (MessagingException e) {
      log.error("Failed to send order success email to {}: {}", toEmail, e.getMessage());
      throw new RuntimeException("Không thể gửi email. Vui lòng thử lại sau.");
    }
  }

  private String buildOrderSuccessHtml(String fullName, String orderId, String transactionNo) {
    return """
        <!DOCTYPE html>
        <html lang="vi">
        <head>
          <meta charset="UTF-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>Thanh toán thành công</title>
        </head>
        <body style="margin:0;padding:0;background:#f8fafc;font-family:system-ui,-apple-system,sans-serif;">
          <table width="100%%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px;">
            <tr>
              <td align="center">
                <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;box-shadow:0 10px 25px rgba(0,0,0,0.05);overflow:hidden;">
                  <tr>
                    <td style="background:linear-gradient(135deg,#10b981,#3b82f6);padding:32px 40px;text-align:center;">
                      <div style="font-size:40px;margin-bottom:8px;">✅</div>
                      <h1 style="margin:0;color:#fff;font-size:1.6rem;font-weight:800;">Thanh toán thành công!</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:36px 40px;">
                      <p style="margin:0 0 16px;color:#334155;font-size:1rem;">Xin chào <strong>%s</strong>,</p>
                      <p style="margin:0 0 24px;color:#475569;font-size:0.95rem;line-height:1.6;">
                        Cảm ơn bạn đã mua sắm tại <strong>Anvi System</strong>. Đơn hàng của bạn đã được thanh toán thành công qua ví VNPay.
                      </p>
                      <div style="background:#f1f5f9;border-radius:12px;padding:20px;margin-bottom:24px;">
                        <p style="margin:0 0 8px;color:#334155;"><strong>Mã đơn hàng:</strong> %s</p>
                        <p style="margin:0;color:#334155;"><strong>Mã giao dịch VNPay:</strong> %s</p>
                      </div>
                      <p style="margin:0;color:#64748b;font-size:0.9rem;">
                        Chúng tôi sẽ sớm chuẩn bị và giao hàng cho bạn. Bạn có thể theo dõi trạng thái đơn hàng trên website của chúng tôi.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
                      <p style="margin:0;color:#94a3b8;font-size:0.8rem;">
                        © 2025 Anvi System. Cảm ơn bạn đã đồng hành!
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
        """
        .formatted(fullName, orderId, transactionNo);
  }
}
