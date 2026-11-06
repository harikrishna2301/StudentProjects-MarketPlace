package com.projectkit.service;

import com.projectkit.dto.request.CreateCategoryRequest;
import com.projectkit.dto.response.CategoryDto;
import com.projectkit.entity.Category;
import com.projectkit.exception.ResourceNotFoundException;
import com.projectkit.repository.CategoryRepository;
import com.projectkit.service.impl.CategoryServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryServiceImpl categoryService;

    private Category activeCategory;

    @BeforeEach
    void setUp() {
        activeCategory = new Category();
        activeCategory.setId(1L);
        activeCategory.setName("Cloud Computing & DevOps");
        activeCategory.setSlug("cloud-computing-devops");
        activeCategory.setDescription("Microservices, Kubernetes, and AWS infrastructure");
        activeCategory.setActive(true);
    }

    @Test
    @DisplayName("Get all active categories returns only active categories")
    void getAllActiveCategories_Success() {
        when(categoryRepository.findByIsActiveTrue()).thenReturn(List.of(activeCategory));

        List<CategoryDto> result = categoryService.getAllActiveCategories();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Cloud Computing & DevOps", result.get(0).getName());
        assertEquals("cloud-computing-devops", result.get(0).getSlug());
    }

    @Test
    @DisplayName("Get category by slug returns mapped DTO")
    void getCategoryBySlug_Success() {
        when(categoryRepository.findBySlug("cloud-computing-devops")).thenReturn(Optional.of(activeCategory));

        CategoryDto result = categoryService.getCategoryBySlug("cloud-computing-devops");

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Cloud Computing & DevOps", result.getName());
    }

    @Test
    @DisplayName("Get category by unknown slug throws ResourceNotFoundException")
    void getCategoryBySlug_NotFound_ThrowsException() {
        when(categoryRepository.findBySlug("unknown-slug")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () ->
                categoryService.getCategoryBySlug("unknown-slug")
        );
    }

    @Test
    @DisplayName("Create category generates unique slug and saves")
    void createCategory_Success() {
        CreateCategoryRequest request = new CreateCategoryRequest();
        request.setName("Cybersecurity and Ethical Hacking");
        request.setDescription("Penetration testing and cryptography projects");

        when(categoryRepository.existsBySlug(anyString())).thenReturn(false);
        when(categoryRepository.save(any(Category.class))).thenAnswer(invocation -> {
            Category c = invocation.getArgument(0);
            c.setId(5L);
            return c;
        });

        CategoryDto created = categoryService.createCategory(request);

        assertNotNull(created);
        assertEquals("Cybersecurity and Ethical Hacking", created.getName());
        assertEquals("cybersecurity-and-ethical-hacking", created.getSlug());
        verify(categoryRepository).save(any(Category.class));
    }
}
