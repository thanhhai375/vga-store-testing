# WHITE-BOX TEST REPORT: Product Admin, Dashboard & User Management

**Module:** Product Admin, Admin Dashboard & User Management  
**Dự án:** VGA Store  
**Jira Tickets Liên Quan:** KCPM-90 (Product Admin) & KCPM-133 (Admin Dashboard)  
**Phạm vi:** Tầng Controller (`ProductController`, `AdminController`, `UserController`) và Service (`ProductService`, `AdminService`, `UserService`)  
**Ngôn ngữ/Công cụ:** Java, Spring Boot, JUnit 5, Mockito, JaCoCo  

---

## 1. Mục tiêu kiểm thử tổng quát

Kiểm thử cấu trúc mã nguồn bên trong (White-box testing) cho toàn bộ các luồng nghiệp vụ của Admin để đảm bảo:
- **Statement/branch coverage:** 100% các dòng code quan trọng và các nhánh `if/else` (của cả hàm tạo sản phẩm, hàm thống kê và hàm khóa/xóa user) được thực thi ít nhất 1 lần.
- **Condition & Role-based testing:** Kiểm tra các điều kiện phức tạp (check quyền Admin, chặn tự khóa tài khoản).
- **Data aggregation testing:** Kiểm tra logic cộng dồn dữ liệu báo cáo thống kê.

---

## PHẦN A: MODULE QUẢN LÝ SẢN PHẨM (JIRA KCPM-90)

### A.1. Phân tích độ phức tạp (Cyclomatic Complexity) cho Create Product
Dựa trên cấu trúc logic của hàm `Create Product` trong `ProductService.java`:

```java
public Product createProduct(ProductRequest request, String adminToken) {
    // Branch 1: Kiểm tra quyền
    if (!authService.isAdmin(adminToken)) throw new UnauthorizedException("Not admin");
    
    // Branch 2: Kiểm tra Brand
    if (!brandRepository.existsById(request.getBrandId())) throw new NotFoundException("Brand not found");
    
    // Branch 3: Kiểm tra Category
    if (!categoryRepository.existsById(request.getCategoryId())) throw new NotFoundException("Category not found");

    Product product = new Product();
    return productRepository.save(product);
}
```
**Tính toán độ phức tạp:**
- Số lượng điểm rẽ nhánh (if) = 3
- Cyclomatic Complexity (V) = Số điểm rẽ nhánh + 1 = 4.
=> **Kết luận:** Hàm có độ phức tạp là 4, cần ít nhất 4 test case độc lập.

### A.2. Kịch bản Unit Test cho ProductService

| STT | Test Case Name | Mô tả (Scenario) | Mock Behavior | Expected Result | Loại Coverage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `createProduct_Success` | Happy path: Dữ liệu hợp lệ | `isAdmin`=true, `existsBrand`=true, `existsCategory`=true | Trả về `Product`, gọi `save()` 1 lần. | Statement |
| 2 | `createProduct_Fail_NotAdmin` | User không phải Admin | `isAdmin`=false | Bắn `UnauthorizedException` | Branch (Branch 1) |
| 3 | `createProduct_Fail_BrandNotFound` | BrandId không tồn tại | `isAdmin`=true, `existsBrand`=false | Bắn `NotFoundException` | Branch (Branch 2) |
| 4 | `createProduct_Fail_CategoryNotFound`| CategoryId không tồn tại | `isAdmin`=true, `existsBrand`=true, `existsCategory`=false| Bắn `NotFoundException` | Branch (Branch 3) |

---

## PHẦN B: MODULE ADMIN DASHBOARD & QUẢN LÝ USER (JIRA KCPM-133)

### B.1. Thống kê Dashboard (Data Aggregation)
Tập trung vào hàm tính toán hiển thị màn hình chính trong `AdminService.getDashboardStats()`

| STT | Test Case Name | Kỹ thuật áp dụng | Mô tả & Mock Behavior | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| 5 | `getStats_Success_ValidData` | Statement Coverage | Giả lập DB trả về 100 users, 50 orders, doanh thu 10M. | Tổng hợp đúng 3 con số trên ra `DashboardResponse`. |
| 6 | `getStats_Success_EmptyData` | Boundary Value | Giả lập DB trống. | Không bị NullPointer, trả về 0. |

### B.2. Quản lý User (Khóa, Mở khóa, Xóa) & Logic Chặn Tự Khóa
Tập trung vào `UserService`. Cực kỳ quan trọng ở logic: **Admin không được phép tự khóa/xóa chính mình**.

| STT | Test Case Name | Kỹ thuật áp dụng | Mô tả & Mock Behavior | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| 7 | `lockUser_Success` | Statement Coverage | ID user hợp lệ, không phải admin hiện tại. | Update status thành `LOCKED`. |
| 8 | `deleteUser_Success` | Statement Coverage | ID user hợp lệ, không dính khóa ngoại. | Xóa thành công. |
| 9 | `lockUser_Fail_SelfLock` | Condition Testing | **ID user bị khóa TRÙNG với ID của Admin đang login.** | Bắn lỗi `BusinessException("Không thể tự khóa chính mình")`. |
| 10 | `deleteUser_Fail_SelfDelete`| Condition Testing | **ID user bị xóa TRÙNG với ID của Admin đang login.** | Bắn lỗi `BusinessException("Không thể tự xóa chính mình")`. |

Đoạn mã giả cho Cyclomatic Complexity phần chặn khóa mình:
```java
public void lockUser(Long targetUserId, Long currentAdminId) {
    User targetUser = userRepository.findById(targetUserId).orElseThrow(...);
    // Điều kiện rẽ nhánh (if = 1)
    if (targetUser.getId().equals(currentAdminId)) {
        throw new BusinessException("Admin cannot lock themselves");
    }
    // ...
}
```
Cyclomatic Complexity (V) = 1 + 1 = 2. Cần 2 Test case (đã cover ở Case 7 và 9).

---

## 3. Mục tiêu Đo lường Code Coverage (JaCoCo)

Cấu hình JaCoCo trong `pom.xml` cần đạt các chỉ tiêu sau cho toàn bộ các package (Product, Admin, User):
- **Line Coverage:** Tối thiểu 85%.
- **Branch Coverage:** Tối thiểu 80%.
- **Class Coverage:** 100%.

## 4. Kết luận
Bộ tài liệu White-box này bao phủ toàn bộ các luồng phức tạp nhất của hệ thống Admin. Việc kết hợp kiểm thử rẽ nhánh hàm `createProduct` (KCPM-90) cùng với kiểm thử logic gom nhóm dữ liệu, chặn quyền tự khóa của tính năng Dashboard/User (KCPM-133) giúp phát hiện sớm các lỗi về logic kinh doanh ngay trong quá trình build code.
