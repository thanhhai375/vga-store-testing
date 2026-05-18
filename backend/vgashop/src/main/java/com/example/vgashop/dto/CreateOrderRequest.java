package com.example.vgashop.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateOrderRequest {

    @NotBlank(message= "Địa chỉ giao hàng không được để trống")
    @Size(max= 255, message="địa chỉ không được vượt quá 255 ký tự")
    private String shippingAddress;

    @NotBlank(message= "Số điện thoại không được để trống")
    @Size(min= 10, max= 15, message= "Số điện thoại phải từ 10 - 15 ký tự")
    private String phone;

    @Size(max= 500, message= "Ghi chú không được vượt quá 500 ký tự")
    private String note;

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
    
}

