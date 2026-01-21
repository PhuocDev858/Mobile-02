package com.example.myApp.controller;

import com.example.myApp.dto.CreateProductRequest;
import com.example.myApp.dto.ProductResponse;
import com.example.myApp.dto.UpdateProductRequest;
import com.example.myApp.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    /**
     * Tạo sản phẩm mới
     * POST /api/products
     */
    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody CreateProductRequest request) {
        try {
            ProductResponse product = productService.createProduct(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(createResponse(true, "Tạo sản phẩm thành công", product));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createResponse(false, e.getMessage(), null));
        }
    }

    /**
     * Lấy tất cả sản phẩm (trả về array trực tiếp)
     * GET /api/products
     */
    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts(@RequestParam(required = false) Boolean active) {
        try {
            List<ProductResponse> products;
            if (active != null && active) {
                products = productService.getActiveProducts();
            } else {
                products = productService.getAllProducts();
            }
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Lấy sản phẩm nổi bật (trả về array trực tiếp)
     * GET /api/products/featured
     */
    @GetMapping("/featured")
    public ResponseEntity<List<ProductResponse>> getFeaturedProducts() {
        try {
            List<ProductResponse> products = productService.getActiveProducts();
            // Lấy 10 sản phẩm đầu tiên làm featured
            List<ProductResponse> featured = products.size() > 10 ? products.subList(0, 10) : products;
            return ResponseEntity.ok(featured);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Lấy sản phẩm theo danh mục
     * GET /api/products/category/{category}
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<?> getProductsByCategory(@PathVariable String category) {
        try {
            List<ProductResponse> products = productService.getProductsByCategory(category);
            return ResponseEntity.ok(createResponse(true, "Lấy sản phẩm theo danh mục thành công", products));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createResponse(false, e.getMessage(), null));
        }
    }

    /**
     * Tìm kiếm sản phẩm
     * GET /api/products/search?keyword=...
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchProducts(@RequestParam String keyword) {
        try {
            List<ProductResponse> products = productService.searchProducts(keyword);
            return ResponseEntity.ok(createResponse(true, "Tìm kiếm sản phẩm thành công", products));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createResponse(false, e.getMessage(), null));
        }
    }

    /**
     * Lấy chi tiết sản phẩm
     * GET /api/products/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        try {
            ProductResponse product = productService.getProductById(id);
            return ResponseEntity.ok(createResponse(true, "Lấy chi tiết sản phẩm thành công", product));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(createResponse(false, e.getMessage(), null));
        }
    }

    /**
     * Cập nhật sản phẩm
     * PUT /api/products/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody UpdateProductRequest request) {
        try {
            ProductResponse product = productService.updateProduct(id, request);
            return ResponseEntity.ok(createResponse(true, "Cập nhật sản phẩm thành công", product));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createResponse(false, e.getMessage(), null));
        }
    }

    /**
     * Vô hiệu hóa sản phẩm
     * PATCH /api/products/{id}/deactivate
     */
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<?> deactivateProduct(@PathVariable Long id) {
        try {
            ProductResponse product = productService.deactivateProduct(id);
            return ResponseEntity.ok(createResponse(true, "Vô hiệu hóa sản phẩm thành công", product));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createResponse(false, e.getMessage(), null));
        }
    }

    /**
     * Xóa sản phẩm
     * DELETE /api/products/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok(createResponse(true, "Xóa sản phẩm thành công", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createResponse(false, e.getMessage(), null));
        }
    }

    private Map<String, Object> createResponse(boolean success, String message, Object data) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", success);
        response.put("message", message);
        response.put("data", data);
        return response;
    }
}
