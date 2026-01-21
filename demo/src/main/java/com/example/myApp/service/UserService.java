package com.example.myApp.service;

import com.example.myApp.dto.AuthRequest;
import com.example.myApp.dto.AuthResponse;
import com.example.myApp.dto.RegisterRequest;
import com.example.myApp.dto.ForgotPasswordRequest;
import com.example.myApp.dto.ResetPasswordRequest;
import com.example.myApp.entity.User;
import com.example.myApp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    public AuthResponse register(RegisterRequest request) {
        // Validate input
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Email không được để trống")
                    .statusCode(400)
                    .build();
        }

        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Username không được để trống")
                    .statusCode(400)
                    .build();
        }

        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Password không được để trống")
                    .statusCode(400)
                    .build();
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Mật khẩu xác nhận không khớp")
                    .statusCode(400)
                    .build();
        }

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Email đã được đăng ký")
                    .statusCode(409)
                    .build();
        }

        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Username đã được sử dụng")
                    .statusCode(409)
                    .build();
        }

        // Create new user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword()); // In production, use BCrypt or similar
        user.setFullName(request.getFullName());
        user.setIsActive(true);

        User savedUser = userRepository.save(user);

        return AuthResponse.builder()
                .success(true)
                .message("Đăng ký thành công")
                .data(savedUser)
                .statusCode(201)
                .build();
    }

    public AuthResponse login(AuthRequest request) {
        // Validate input
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Email không được để trống")
                    .statusCode(400)
                    .build();
        }

        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Password không được để trống")
                    .statusCode(400)
                    .build();
        }

        // Find user by email
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

        if (userOptional.isEmpty()) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Email hoặc mật khẩu không chính xác")
                    .statusCode(401)
                    .build();
        }

        User user = userOptional.get();

        // Check password (in production, use BCrypt.matches())
        if (!user.getPassword().equals(request.getPassword())) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Email hoặc mật khẩu không chính xác")
                    .statusCode(401)
                    .build();
        }

        // Check if user is active
        if (!user.getIsActive()) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Tài khoản không hoạt động")
                    .statusCode(403)
                    .build();
        }

        return AuthResponse.builder()
                .success(true)
                .message("Đăng nhập thành công")
                .data(user)
                .statusCode(200)
                .build();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    public boolean usernameExists(String username) {
        return userRepository.existsByUsername(username);
    }

    public java.util.List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public AuthResponse forgotPassword(ForgotPasswordRequest request) {
        // Validate input
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Email không được để trống")
                    .statusCode(400)
                    .build();
        }

        // Find user by email
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

        if (userOptional.isEmpty()) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Email không tồn tại trong hệ thống")
                    .statusCode(404)
                    .build();
        }

        User user = userOptional.get();

        // Generate OTP 6 chữ số
        String otp = generateOTP();
        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10)); // OTP valid for 10 minutes

        userRepository.save(user);

        // Send email with OTP
        try {
            emailService.sendResetPasswordOTP(user.getEmail(), otp);
            return AuthResponse.builder()
                    .success(true)
                    .message("Mã OTP đã được gửi đến email của bạn")
                    .statusCode(200)
                    .build();
        } catch (Exception e) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Không thể gửi email: " + e.getMessage())
                    .statusCode(500)
                    .build();
        }
    }

    public AuthResponse resetPassword(ResetPasswordRequest request) {
        // Validate input
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Email không được để trống")
                    .statusCode(400)
                    .build();
        }

        if (request.getResetToken() == null || request.getResetToken().trim().isEmpty()) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Mã xác thực không được để trống")
                    .statusCode(400)
                    .build();
        }

        if (request.getNewPassword() == null || request.getNewPassword().trim().isEmpty()) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Mật khẩu mới không được để trống")
                    .statusCode(400)
                    .build();
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Mật khẩu xác nhận không khớp")
                    .statusCode(400)
                    .build();
        }

        // Find user by email
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

        if (userOptional.isEmpty()) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Email không tồn tại trong hệ thống")
                    .statusCode(404)
                    .build();
        }

        User user = userOptional.get();

        // Verify reset token
        if (user.getResetToken() == null || !user.getResetToken().equals(request.getResetToken())) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Mã xác thực không hợp lệ")
                    .statusCode(400)
                    .build();
        }

        // Check if token is expired
        if (user.getResetTokenExpiry() == null || LocalDateTime.now().isAfter(user.getResetTokenExpiry())) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Mã xác thực đã hết hạn")
                    .statusCode(400)
                    .build();
        }

        // Reset password
        user.setPassword(request.getNewPassword()); // In production, use BCrypt
        user.setResetToken(null);
        user.setResetTokenExpiry(null);

        userRepository.save(user);

        return AuthResponse.builder()
                .success(true)
                .message("Đặt lại mật khẩu thành công")
                .statusCode(200)
                .build();
    }

    public AuthResponse verifyResetToken(String email, String resetToken) {
        // Validate input
        if (email == null || email.trim().isEmpty()) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Email không được để trống")
                    .statusCode(400)
                    .build();
        }

        if (resetToken == null || resetToken.trim().isEmpty()) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Mã xác thực không được để trống")
                    .statusCode(400)
                    .build();
        }

        // Find user by email
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Email không tồn tại trong hệ thống")
                    .statusCode(404)
                    .build();
        }

        User user = userOptional.get();

        // Verify reset token
        if (user.getResetToken() == null || !user.getResetToken().equals(resetToken)) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Mã xác thực không hợp lệ")
                    .statusCode(400)
                    .build();
        }

        // Check if token is expired
        if (user.getResetTokenExpiry() == null || LocalDateTime.now().isAfter(user.getResetTokenExpiry())) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Mã xác thực đã hết hạn")
                    .statusCode(400)
                    .build();
        }

        return AuthResponse.builder()
                .success(true)
                .message("Mã xác thực hợp lệ")
                .statusCode(200)
                .build();
    }

    /**
     * Generate OTP 6 chữ số ngẫu nhiên
     */
    private String generateOTP() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000); // Generate 6-digit number
        return String.valueOf(otp);
    }

    /**
     * Verify OTP
     */
    public AuthResponse verifyOTP(String email, String otp) {
        // Validate input
        if (email == null || email.trim().isEmpty()) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Email không được để trống")
                    .statusCode(400)
                    .build();
        }

        if (otp == null || otp.trim().isEmpty()) {
            return AuthResponse.builder()
                    .success(false)
                    .message("OTP không được để trống")
                    .statusCode(400)
                    .build();
        }

        // Find user by email
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Email không tồn tại trong hệ thống")
                    .statusCode(404)
                    .build();
        }

        User user = userOptional.get();

        // Verify OTP
        if (user.getOtp() == null || !user.getOtp().equals(otp)) {
            return AuthResponse.builder()
                    .success(false)
                    .message("OTP không hợp lệ")
                    .statusCode(400)
                    .build();
        }

        // Check if OTP is expired
        if (user.getOtpExpiry() == null || LocalDateTime.now().isAfter(user.getOtpExpiry())) {
            return AuthResponse.builder()
                    .success(false)
                    .message("OTP đã hết hạn")
                    .statusCode(400)
                    .build();
        }

        return AuthResponse.builder()
                .success(true)
                .message("OTP hợp lệ")
                .statusCode(200)
                .build();
    }
}
