package com.example.vgashop.exception;



/*
dùng khi:
Category name đã tồn tại
Brand name đã tồn tại
Product SKU đã tồn tại
*/
public class DuplicateResourceException extends RuntimeException {

    public DuplicateResourceException(String message) {
        super(message);
    }

}
