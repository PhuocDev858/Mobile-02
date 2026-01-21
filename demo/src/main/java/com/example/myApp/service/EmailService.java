package com.example.myApp.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    /**
     * Gửi email chứa OTP 6 chữ số để reset password
     */
    public void sendResetPasswordOTP(String toEmail, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@myapp.com");
            message.setTo(toEmail);
            message.setSubject("Mã xác nhận đặt lại mật khẩu - Mobile Shop");
            
            String emailBody = "Xin chào,\n\n" +
                    "Bạn đã yêu cầu đặt lại mật khẩu.\n\n" +
                    "Mã xác nhận của bạn là:\n" +
                    "🔐 " + otp + "\n\n" +
                    "Mã này sẽ hết hạn sau 10 phút.\n\n" +
                    "Vui lòng không chia sẻ mã này với bất kỳ ai.\n\n" +
                    "Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.\n\n" +
                    "Trân trọng,\n" +
                    "Đội ngũ Mobile Shop";
            
            message.setText(emailBody);
            
            mailSender.send(message);
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }
}
