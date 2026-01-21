package com.example.myApp.controller;

import com.example.myApp.dto.CategoryResponse;
import com.example.myApp.dto.CreateCategoryRequest;
import com.example.myApp.dto.UpdateCategoryRequest;
import com.example.myApp.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CategoryController {

    private final CategoryService categoryService;

    /**
     * Tạo danh mục mới
     * POST /api/categories
     */
    @PostMapping
    public ResponseEntity<?> createCategory(@RequestBody CreateCategoryRequest request) {
        try {
            CategoryResponse category = categoryService.createCategory(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(createResponse(true, "Tạo danh mục thành công", category));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createResponse(false, e.getMessage(), null));
        }
    }

    /**
     * Lấy tất cả danh mục (trả về array trực tiếp)
     * GET /api/categories
     */
    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAllCategories(@RequestParam(required = false) Boolean active) {
        try {
            List<CategoryResponse> categories;
            if (active != null && active) {
                categories = categoryService.getActiveCategories();
            } else {
                categories = categoryService.getAllCategories();
            }
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Lấy chi tiết danh mục
     * GET /api/categories/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getCategoryById(@PathVariable Long id) {
        try {
            CategoryResponse category = categoryService.getCategoryById(id);
            return ResponseEntity.ok(createResponse(true, "Lấy chi tiết danh mục thành công", category));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(createResponse(false, e.getMessage(), null));
        }
    }

    /**
     * Cập nhật danh mục
     * PUT /api/categories/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @RequestBody UpdateCategoryRequest request) {
        try {
            CategoryResponse category = categoryService.updateCategory(id, request);
            return ResponseEntity.ok(createResponse(true, "Cập nhật danh mục thành công", category));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createResponse(false, e.getMessage(), null));
        }
    }

    /**
     * Vô hiệu hóa danh mục
     * PATCH /api/categories/{id}/deactivate
     */
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<?> deactivateCategory(@PathVariable Long id) {
        try {
            CategoryResponse category = categoryService.deactivateCategory(id);
            return ResponseEntity.ok(createResponse(true, "Vô hiệu hóa danh mục thành công", category));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createResponse(false, e.getMessage(), null));
        }
    }

    /**
     * Xóa danh mục
     * DELETE /api/categories/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        try {
            categoryService.deleteCategory(id);
            return ResponseEntity.ok(createResponse(true, "Xóa danh mục thành công", null));
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
