package com.example.myApp.controller;

import com.example.myApp.dto.AuthRequest;
import com.example.myApp.dto.AuthResponse;
import com.example.myApp.dto.RegisterRequest;
import com.example.myApp.dto.ForgotPasswordRequest;
import com.example.myApp.dto.ResetPasswordRequest;
import com.example.myApp.service.UserService;
import com.example.myApp.util.JwtUtil;
import com.example.myApp.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        AuthResponse response = userService.register(request);
        HttpStatus status = response.isSuccess() ? HttpStatus.CREATED : 
                           (response.getStatusCode() == 409 ? HttpStatus.CONFLICT : HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(response, status);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        AuthResponse response = userService.login(request);
        
        if (response.isSuccess() && response.getData() instanceof User) {
            User user = (User) response.getData();
            String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getUsername());
            
            Map<String, Object> data = new HashMap<>();
            data.put("token", token);
            data.put("user", user);
            response.setData(data);
        }
        
        HttpStatus status = response.isSuccess() ? HttpStatus.OK : 
                           (response.getStatusCode() == 401 ? HttpStatus.UNAUTHORIZED : HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(response, status);
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getCurrentUser(HttpServletRequest request) {
        Boolean authenticated = (Boolean) request.getAttribute("authenticated");
        
        if (authenticated == null || !authenticated) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                AuthResponse.builder()
                    .success(false)
                    .message("Unauthorized - Token không hợp lệ hoặc đã hết hạn")
                    .statusCode(401)
                    .build()
            );
        }
        
        Long userId = (Long) request.getAttribute("userId");
        String email = (String) request.getAttribute("email");
        
        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return ResponseEntity.ok(
            AuthResponse.builder()
                .success(true)
                .message("Lấy thông tin người dùng thành công")
                .data(user)
                .statusCode(200)
                .build()
        );
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("API is running");
    }

    @GetMapping("/check-email")
    public ResponseEntity<AuthResponse> checkEmail(@RequestParam(required = false) String email) {
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(
                    AuthResponse.builder()
                            .success(false)
                            .message("Email không được để trống")
                            .statusCode(400)
                            .build()
            );
        }

        boolean exists = userService.emailExists(email);
        
        if (exists) {
            return ResponseEntity.ok(
                    AuthResponse.builder()
                            .success(false)
                            .message("Email đã được đăng ký")
                            .data(false)
                            .statusCode(200)
                            .build()
            );
        } else {
            return ResponseEntity.ok(
                    AuthResponse.builder()
                            .success(true)
                            .message("Email chưa được đăng ký")
                            .data(true)
                            .statusCode(200)
                            .build()
            );
        }
    }

    @GetMapping("/check-username")
    public ResponseEntity<AuthResponse> checkUsername(@RequestParam(required = false) String username) {
        if (username == null || username.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(
                    AuthResponse.builder()
                            .success(false)
                            .message("Username không được để trống")
                            .statusCode(400)
                            .build()
            );
        }

        boolean exists = userService.usernameExists(username);
        
        if (exists) {
            return ResponseEntity.ok(
                    AuthResponse.builder()
                            .success(false)
                            .message("Username đã được sử dụng")
                            .data(false)
                            .statusCode(200)
                            .build()
            );
        } else {
            return ResponseEntity.ok(
                    AuthResponse.builder()
                            .success(true)
                            .message("Username chưa được sử dụng")
                            .data(true)
                            .statusCode(200)
                            .build()
            );
        }
    }

    @GetMapping("/users")
    public ResponseEntity<AuthResponse> getAllUsers() {
        java.util.List<com.example.myApp.entity.User> users = userService.getAllUsers();
        
        if (users.isEmpty()) {
            return ResponseEntity.ok(
                    AuthResponse.builder()
                            .success(true)
                            .message("Chưa có người dùng nào")
                            .data(users)
                            .statusCode(200)
                            .build()
            );
        }
        
        return ResponseEntity.ok(
                AuthResponse.builder()
                        .success(true)
                        .message("Lấy danh sách người dùng thành công")
                        .data(users)
                        .statusCode(200)
                        .build()
        );
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<AuthResponse> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        AuthResponse response = userService.forgotPassword(request);
        HttpStatus status = response.isSuccess() ? HttpStatus.OK : 
                           (response.getStatusCode() == 404 ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(response, status);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<AuthResponse> resetPassword(@RequestBody ResetPasswordRequest request) {
        AuthResponse response = userService.resetPassword(request);
        HttpStatus status = response.isSuccess() ? HttpStatus.OK : 
                           (response.getStatusCode() == 404 ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(response, status);
    }

    /**
     * Verify OTP
     * POST /api/auth/verify-otp
     * Body: {"email": "...", "otp": "..."} hoặc {"email": "...", "code": "..."}
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOTP(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        // Support cả "otp" và "code" fields
        String otp = request.get("otp");
        if (otp == null || otp.trim().isEmpty()) {
            otp = request.get("code");
        }

        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(
                    AuthResponse.builder()
                            .success(false)
                            .message("Email không được để trống")
                            .statusCode(400)
                            .build()
            );
        }

        if (otp == null || otp.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(
                    AuthResponse.builder()
                            .success(false)
                            .message("OTP không được để trống")
                            .statusCode(400)
                            .build()
            );
        }

        AuthResponse response = userService.verifyOTP(email, otp);
        HttpStatus status = response.isSuccess() ? HttpStatus.OK : 
                           (response.getStatusCode() == 404 ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(response, status);
    }

    /**
     * Verify reset token hợp lệ
     * GET /api/auth/verify-reset-token?token=xxx&email=yyy
     */
    @GetMapping("/verify-reset-token")
    public ResponseEntity<AuthResponse> verifyResetToken(
            @RequestParam(required = false) String token,
            @RequestParam(required = false) String email) {
        
        if (token == null || token.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(
                    AuthResponse.builder()
                            .success(false)
                            .message("Mã xác thực không được để trống")
                            .statusCode(400)
                            .build()
            );
        }

        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(
                    AuthResponse.builder()
                            .success(false)
                            .message("Email không được để trống")
                            .statusCode(400)
                            .build()
            );
        }

        AuthResponse response = userService.verifyResetToken(email, token);
        HttpStatus status = response.isSuccess() ? HttpStatus.OK : 
                           (response.getStatusCode() == 404 ? HttpStatus.NOT_FOUND : 
                            response.getStatusCode() == 400 ? HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR);
        return new ResponseEntity<>(response, status);
    }
}
