package com.example.vgashop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class BrandDTO {

    private Long id;

    @NotBlank(message= "Tên thương hiệu không được để trống")
    @Size(min= 4, max= 255, message= "Tên thương hiệu phải từ 4 đến 255 ký tự")
    private String name;

   @Size(max = 255, message = "Đường dẫn logo không được vượt quá 255 ký tự")
    private String logo;

    @Size(max= 250, message= "Mô tả không vượt quá 250 ký tự")
    private String description;

    private Boolean status = true;


    @Size(max = 150, message = "Slug không được vượt quá 150 ký tự")
    private String slug;

    public BrandDTO() {}

    // setter getter
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

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }
    
}

