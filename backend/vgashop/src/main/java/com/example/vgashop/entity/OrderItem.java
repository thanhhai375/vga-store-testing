package com.example.vgashop.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import java.math.BigDecimal;

@Entity
@Table(name= "order_items")
public class OrderItem extends BaseEntity {

    @Column(name= "quantity", nullable= false)
    private Integer quantity;

    @Column(name= "price", nullable= false, precision= 12, scale= 2)
    private BigDecimal price;

    @ManyToOne(fetch= FetchType.LAZY)
    @JoinColumn(name= "order_id", nullable= false) 
    private Order order;

    @ManyToOne(fetch= FetchType.EAGER)
    @JoinColumn(name= "product_id", nullable= false)
    private Product product;

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    /**
     * Tính subtotal on-the-fly để đạt chuẩn 3NF.
     * Không lưu vào database, tránh phụ thuộc bắc cầu {price, quantity} → subtotal.
     */
    @Transient
    public BigDecimal getSubtotal() {
        if (price != null && quantity != null) {
            return price.multiply(BigDecimal.valueOf(quantity));
        }
        return BigDecimal.ZERO;
    }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
}

