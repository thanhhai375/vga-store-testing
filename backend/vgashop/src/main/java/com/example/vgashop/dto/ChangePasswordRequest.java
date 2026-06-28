package com.example.vgashop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChangePasswordRequest {
    @NotBlank(message = "Mật khẩu cũ không được trống")
    private String oldPassword;
    
    @NotBlank(message = "Mật khẩu mới không được trống")
    @Size(min = 8, max = 64, message = "Mật khẩu mới phải từ 8 đến 64 ký tự")
    @Pattern(regexp = "^(?!.*\\s)(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).+$", message = "Mật khẩu mới phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt và không có khoảng trắng")
    private String newPassword;
    
    @NotBlank(message = "Mật khẩu xác nhận không được trống")
    private String confirmPassword;
}
