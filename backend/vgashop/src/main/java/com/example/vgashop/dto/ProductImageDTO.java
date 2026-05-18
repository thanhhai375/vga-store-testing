package com.example.vgashop.dto;

import java.math.BigDecimal;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public class ProductImageDTO {

    @NotBlank(message = "Tên sản phẩm là bắt buộc")
    @Size(min = 3, max = 255, message = "Tên sản phẩm phải từ 3 đến 255 ký tự")
    private String name;

    private String description;

    // Image
    private MultipartFile imageFile;

    @NotNull(message = "Giá sản phẩm là bắt buộc")
    @Positive(message = "Giá phải lớn hơn 0")
    private BigDecimal price;

    private BigDecimal oldPrice;

    @NotNull(message = "Số lượng tồn kho là bắt buộc")
    @Min(value = 0, message = "Số lượng không được âm")
    private Integer stock;
    
    @NotNull(message = "Thương hiệu là bắt buộc")
    private Long brandId;

    @NotNull(message = "Danh mục là bắt buộc")
    private Long categoryId;

    private String sku;

    private String gpuModel;
    private String vram;
    private String memoryType;
    private String coolingType;
    private String powerConnectors;
    private String recommendedPsu;
    private String dimension;

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
    
    public BigDecimal getPrice() {
        return price;
    }
    public void setPrice(BigDecimal price) {
        this.price = price;
    }
    public BigDecimal getOldPrice() {
        return oldPrice;
    }
    public void setOldPrice(BigDecimal oldPrice) {
        this.oldPrice = oldPrice;
    }
    public Integer getStock() {
        return stock;
    }
    public void setStock(Integer stock) {
        this.stock = stock;
    }
    public Long getBrandId() {
        return brandId;
    }
    public void setBrandId(Long brandId) {
        this.brandId = brandId;
    }
    public Long getCategoryId() {
        return categoryId;
    }
    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }
    public String getSku() {
        return sku;
    }
    public void setSku(String sku) {
        this.sku = sku;
    }
    public MultipartFile getImageFile() {
        return imageFile;
    }
    public void setImageFile(MultipartFile imageFile) {
        this.imageFile = imageFile;
    }

    public String getGpuModel() { return gpuModel; }
    public void setGpuModel(String gpuModel) { this.gpuModel = gpuModel; }

    public String getVram() { return vram; }
    public void setVram(String vram) { this.vram = vram; }

    public String getMemoryType() { return memoryType; }
    public void setMemoryType(String memoryType) { this.memoryType = memoryType; }

    public String getCoolingType() { return coolingType; }
    public void setCoolingType(String coolingType) { this.coolingType = coolingType; }

    public String getPowerConnectors() { return powerConnectors; }
    public void setPowerConnectors(String powerConnectors) { this.powerConnectors = powerConnectors; }

    public String getRecommendedPsu() { return recommendedPsu; }
    public void setRecommendedPsu(String recommendedPsu) { this.recommendedPsu = recommendedPsu; }

    public String getDimension() { return dimension; }
    public void setDimension(String dimension) { this.dimension = dimension; }

}

