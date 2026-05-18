package com.example.vgashop.dto;

import java.math.BigDecimal;


// Product
public class ProductAdminResponse {

    private Long productId; // Product
    private String name; // Product
    private BigDecimal price; // Product
    private Integer stock;
    private String brandName;
    private String categoryName;
    private Boolean status; // Product
    private String imgUrl; // Product

    public ProductAdminResponse(Long productId, String name, BigDecimal price, Integer stock, String brandName,
            String categoryName, Boolean status, String imgUrl) {
        this.productId = productId;
        this.name = name;
        this.price = price;
        this.stock = stock;
        this.brandName = brandName;
        this.categoryName = categoryName;
        this.status = status;
        this.imgUrl = imgUrl;
    }

    public ProductAdminResponse() {}

    

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
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

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public String getBrandName() {
        return brandName;
    }

    public void setBrandName(String brandName) {
        this.brandName = brandName;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public String getImgUrl() {
        return imgUrl;
    }

    public void setImgUrl(String imgUrl) {
        this.imgUrl = imgUrl;
    }

}

