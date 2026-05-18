package com.example.vgashop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserAddressDto {
    private Long id;
    private String recipientName;
    private String phone;
    private String detailedAddress;
    private Boolean isDefault;
}
