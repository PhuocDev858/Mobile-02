package com.example.myApp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class DeeplinkController {

    /**
     * Handle deeplink redirect cho reset password
     * GET /reset-password?token=xxx&email=yyy
     */
    @GetMapping("/reset-password")
    public String resetPasswordDeeplink(
            @RequestParam(required = false) String token,
            @RequestParam(required = false) String email,
            Model model) {
        
        model.addAttribute("token", token);
        model.addAttribute("email", email);
        
        return "forward:/reset-password.html";
    }

    /**
     * Handle deeplink redirect cho các page khác
     * GET /deeplink?action=reset-password&token=xxx&email=yyy
     */
    @GetMapping("/deeplink")
    public String handleDeeplink(
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String token,
            @RequestParam(required = false) String email,
            Model model) {
        
        if ("reset-password".equals(action)) {
            model.addAttribute("token", token);
            model.addAttribute("email", email);
            return "forward:/reset-password.html";
        }
        
        return "redirect:/";
    }
}
