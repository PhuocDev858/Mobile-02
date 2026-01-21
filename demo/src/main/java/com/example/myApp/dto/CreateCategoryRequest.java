package com.example.myApp.dto;

import lombok.Data;

@Data
public class CreateCategoryRequest {
    private String name;
    private String description;
    private String imageUrl;
}
