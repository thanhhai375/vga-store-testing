package com.example.vgashop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CategoryDTO {


    private Long id;

    @NotBlank(message = "Category name is required")
    @Size(
        min = 2,
        max = 200,
        message = "Category name must be between 2 and 200 characters"
    )
    private String name;

    @Size(
        max= 500,
        message= "Description must be less than 500 characters"
    )
    private String description;

    private boolean active = true;

    CategoryDTO() {}

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}

