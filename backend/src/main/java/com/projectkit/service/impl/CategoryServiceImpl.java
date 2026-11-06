package com.projectkit.service.impl;

import com.projectkit.dto.request.CreateCategoryRequest;
import com.projectkit.dto.response.CategoryDto;
import com.projectkit.entity.Category;
import com.projectkit.exception.BadRequestException;
import com.projectkit.exception.ResourceNotFoundException;
import com.projectkit.repository.CategoryRepository;
import com.projectkit.service.CategoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryDto> getAllActiveCategories() {
        return categoryRepository.findByIsActiveTrue().stream()
                .map(CategoryDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(CategoryDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryDto getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        return CategoryDto.fromEntity(category);
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryDto getCategoryBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "slug", slug));
        return CategoryDto.fromEntity(category);
    }

    @Override
    @Transactional
    public CategoryDto createCategory(CreateCategoryRequest request) {
        if (categoryRepository.existsByName(request.getName().trim())) {
            throw new BadRequestException("Category name already exists: " + request.getName());
        }

        String slug = (request.getSlug() != null && !request.getSlug().isBlank())
                ? toSlug(request.getSlug())
                : toSlug(request.getName());

        if (categoryRepository.existsBySlug(slug)) {
            slug = slug + "-" + System.currentTimeMillis();
        }

        Category category = new Category();
        category.setName(request.getName().trim());
        category.setSlug(slug);
        category.setDescription(request.getDescription());
        category.setIconName(request.getIconName());
        category.setActive(request.getIsActive() == null || request.getIsActive());

        Category saved = categoryRepository.save(category);
        return CategoryDto.fromEntity(saved);
    }

    @Override
    @Transactional
    public CategoryDto updateCategory(Long id, CreateCategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));

        if (!category.getName().equalsIgnoreCase(request.getName().trim()) &&
                categoryRepository.existsByName(request.getName().trim())) {
            throw new BadRequestException("Category name already exists: " + request.getName());
        }

        category.setName(request.getName().trim());
        if (request.getSlug() != null && !request.getSlug().isBlank()) {
            category.setSlug(toSlug(request.getSlug()));
        }
        category.setDescription(request.getDescription());
        category.setIconName(request.getIconName());
        if (request.getIsActive() != null) {
            category.setActive(request.getIsActive());
        }

        Category updated = categoryRepository.save(category);
        return CategoryDto.fromEntity(updated);
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        categoryRepository.delete(category);
    }

    private String toSlug(String input) {
        String nowhitespace = WHITESPACE.matcher(input.trim()).replaceAll("-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = NONLATIN.matcher(normalized).replaceAll("");
        return slug.toLowerCase(Locale.ENGLISH);
    }
}
