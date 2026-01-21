package com.example.myApp.filter;

import com.example.myApp.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String authHeader = request.getHeader("Authorization");
        
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                String email = jwtUtil.extractEmail(token);
                Long userId = jwtUtil.extractUserId(token);
                String username = jwtUtil.extractUsername(token);
                
                // Set user info as request attributes
                request.setAttribute("userId", userId);
                request.setAttribute("email", email);
                request.setAttribute("username", username);
                request.setAttribute("authenticated", true);
            } catch (Exception e) {
                // Invalid token
                request.setAttribute("authenticated", false);
            }
        } else {
            request.setAttribute("authenticated", false);
        }
        
        filterChain.doFilter(request, response);
    }
}
