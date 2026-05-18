package com.example.vgashop.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ProductDTO {

    private Long id;

    @NotBlank(message= "Tên sản phẩm không được để trống")
    @Size(min= 3, max= 255, message= "Tên sản phẩm phải từ 3 đến 255 ký tự")
    private String name;

    @NotNull(message= "Giá sản phẩm không được để trống")
    @DecimalMin(value= "0.01", message= "Giá phải lớn hoặc bằng 0.01")
    private BigDecimal price;

    @DecimalMin(value= "0.01", message= "Giá gốc phải lớn hoặc bằng 0.01")
    private BigDecimal oldPrice;

    @Min(value= 0, message= "Số lượng tồn kho không được âm")
    private Integer stock;

    @Size(max= 2000, message= "Mô tả không vượt quá 2000 ký tự")
    private String description;

    @Size(max= 500, message= "Đường dẫn hình ảnh không vượt quá 500 ký tự")
    private String imgUrl;

    @Size(max= 80, message= "Sku không vượt quá 80 ký tự")
    private String sku;

    @NotNull(message= "Thương hiệu là bắt buộc")
    private Long brandId;

    @NotBlank(message= "Danh mục là bắt buộc")
    private Long categoryID;

    // Constuctor
    public ProductDTO() {}


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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImgUrl() {
        return imgUrl;
    }

    public void setImgUrl(String imgUrl) {
        this.imgUrl = imgUrl;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public Long getBrandId() {
        return brandId;
    }

    public void setBrandId(Long brandId) {
        this.brandId = brandId;
    }

    public Long getCategoryID() {
        return categoryID;
    }

    public void setCategoryID(Long categoryID) {
        this.categoryID = categoryID;
    }
    
}
