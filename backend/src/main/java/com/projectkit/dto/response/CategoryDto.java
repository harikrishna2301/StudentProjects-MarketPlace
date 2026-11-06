package com.projectkit.dto.response;

import com.projectkit.entity.Category;

public class CategoryDto {

    private Long id;
    private String name;
    private String slug;
    private String description;
    private String iconName;
    private boolean isActive;

    public CategoryDto() {
    }

    public CategoryDto(Long id, String name, String slug, String description, String iconName, boolean isActive) {
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.description = description;
        this.iconName = iconName;
        this.isActive = isActive;
    }

    public static CategoryDto fromEntity(Category category) {
        return new CategoryDto(
                category.getId(),
                category.getName(),
                category.getSlug(),
                category.getDescription(),
                category.getIconName(),
                category.isActive()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIconName() {
        return iconName;
    }

    public void setIconName(String iconName) {
        this.iconName = iconName;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }
}
