package com.example.myApp.controller;

import com.example.myApp.dto.OrderRequest;
import com.example.myApp.dto.OrderResponse;
import com.example.myApp.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    /**
     * Tạo đơn hàng mới
     * POST /api/orders/create
     */
    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest request, HttpServletRequest httpRequest) {
        try {
            // Get userId from JWT token
            Boolean authenticated = (Boolean) httpRequest.getAttribute("authenticated");
            if (authenticated == null || !authenticated) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "Vui lòng đăng nhập để tạo đơn hàng");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }
            
            Long userId = (Long) httpRequest.getAttribute("userId");
            OrderResponse order = orderService.createOrder(userId, request);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Tạo đơn hàng thành công");
            response.put("data", order);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    /**
     * Lấy tất cả đơn hàng (Admin)
     * GET /api/orders
     */
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        List<OrderResponse> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }
    
    /**
     * Lấy đơn hàng của user đang đăng nhập
     * GET /api/orders/my-orders
     */
    @GetMapping("/my-orders")
    public ResponseEntity<?> getMyOrders(HttpServletRequest httpRequest) {
        try {
            Boolean authenticated = (Boolean) httpRequest.getAttribute("authenticated");
            if (authenticated == null || !authenticated) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "Vui lòng đăng nhập");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }
            
            Long userId = (Long) httpRequest.getAttribute("userId");
            List<OrderResponse> orders = orderService.getOrdersByUserId(userId);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    /**
     * Lấy đơn hàng theo ID
     * GET /api/orders/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        try {
            OrderResponse order = orderService.getOrderById(id);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }
    
    /**
     * Lấy đơn hàng của user cụ thể (Admin)
     * GET /api/orders/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderResponse>> getOrdersByUserId(@PathVariable Long userId) {
        List<OrderResponse> orders = orderService.getOrdersByUserId(userId);
        return ResponseEntity.ok(orders);
    }
    
    /**
     * Lấy đơn hàng theo trạng thái
     * GET /api/orders/status/{status}
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<?> getOrdersByStatus(@PathVariable String status) {
        try {
            List<OrderResponse> orders = orderService.getOrdersByStatus(status);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    /**
     * Cập nhật trạng thái đơn hàng (Admin)
     * PUT /api/orders/{id}/status
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String status = request.get("status");
            if (status == null || status.isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "Trạng thái không được để trống");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }
            
            OrderResponse order = orderService.updateOrderStatus(id, status);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Cập nhật trạng thái thành công");
            response.put("data", order);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    /**
     * Lấy trạng thái thanh toán của đơn hàng
     * GET /api/orders/{id}/payment-status
     */
    @GetMapping("/{id}/payment-status")
    public ResponseEntity<?> getPaymentStatus(@PathVariable(required = false) Long id) {
        try {
            if (id == null || id <= 0) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "ID đơn hàng không hợp lệ");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }
            
            OrderResponse order = orderService.getOrderById(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("paymentStatus", order.getPaymentStatus());
            response.put("status", order.getStatus());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }
    
    /**
     * Cập nhật trạng thái thanh toán (Admin)
     * PUT /api/orders/{id}/payment-status
     */
    @PutMapping("/{id}/payment-status")
    public ResponseEntity<?> updatePaymentStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String paymentStatus = request.get("paymentStatus");
            if (paymentStatus == null || paymentStatus.isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "Trạng thái thanh toán không được để trống");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }
            
            OrderResponse order = orderService.updatePaymentStatus(id, paymentStatus);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Cập nhật trạng thái thanh toán thành công");
            response.put("data", order);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    /**
     * Hủy đơn hàng
     * PUT /api/orders/{id}/cancel
     */
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Long id, HttpServletRequest httpRequest) {
        try {
            Boolean authenticated = (Boolean) httpRequest.getAttribute("authenticated");
            if (authenticated == null || !authenticated) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "Vui lòng đăng nhập");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }
            
            Long userId = (Long) httpRequest.getAttribute("userId");
            orderService.cancelOrder(id, userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Hủy đơn hàng thành công");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
}
