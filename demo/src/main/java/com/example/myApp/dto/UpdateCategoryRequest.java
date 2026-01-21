package com.example.myApp.dto;

import lombok.Data;

@Data
public class UpdateCategoryRequest {
    private String name;
    private String description;
    private String imageUrl;
    private Boolean isActive;
}
