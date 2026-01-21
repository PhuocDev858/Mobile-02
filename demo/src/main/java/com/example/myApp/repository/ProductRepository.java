package com.example.myApp.repository;

import com.example.myApp.entity.Product;
import com.example.myApp.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(Category category);
    List<Product> findByIsActive(Boolean isActive);
    List<Product> findByNameContainingIgnoreCase(String name);
    List<Product> findByCategoryAndIsActive(Category category, Boolean isActive);
    List<Product> findByCategoryId(Long categoryId);
}
