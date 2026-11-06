package com.projectkit.controller;

import com.projectkit.dto.response.ApiResponse;
import com.projectkit.dto.response.CategoryDto;
import com.projectkit.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/categories")
@Tag(name = "Categories", description = "Public endpoints to browse project categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    @Operation(summary = "Get all active categories", description = "Returns active project categories for students to filter projects")
    public ResponseEntity<ApiResponse<List<CategoryDto>>> getAllActiveCategories() {
        List<CategoryDto> categories = categoryService.getAllActiveCategories();
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(1, TimeUnit.HOURS).cachePublic())
                .body(ApiResponse.success(categories));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Get category by slug", description = "Retrieves category information by its URL slug")
    public ResponseEntity<ApiResponse<CategoryDto>> getCategoryBySlug(@PathVariable String slug) {
        CategoryDto category = categoryService.getCategoryBySlug(slug);
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(1, TimeUnit.HOURS).cachePublic())
                .body(ApiResponse.success(category));
    }
}
