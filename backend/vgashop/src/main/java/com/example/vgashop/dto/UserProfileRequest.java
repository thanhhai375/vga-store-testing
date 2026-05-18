package com.example.vgashop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileRequest {
    private String username;
    private String phone;
    private String gender;
    private LocalDate dob;
}
