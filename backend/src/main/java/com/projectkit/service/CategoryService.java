package com.projectkit.service;

import com.projectkit.dto.request.CreateCategoryRequest;
import com.projectkit.dto.response.CategoryDto;

import java.util.List;

public interface CategoryService {

    List<CategoryDto> getAllActiveCategories();

    List<CategoryDto> getAllCategories();

    CategoryDto getCategoryById(Long id);

    CategoryDto getCategoryBySlug(String slug);

    CategoryDto createCategory(CreateCategoryRequest request);

    CategoryDto updateCategory(Long id, CreateCategoryRequest request);

    void deleteCategory(Long id);
}
