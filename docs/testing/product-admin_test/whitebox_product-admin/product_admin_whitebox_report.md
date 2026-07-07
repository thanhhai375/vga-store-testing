# WHITE-BOX TEST REPORT: Product Admin Module

**Module:** Product Admin  
**Dự án:** VGA Store  
**Phạm vi:** Tầng Controller (`ProductController`) và Service (`ProductService`)  
**Ngôn ngữ/Công cụ:** Java, Spring Boot, JUnit 5, Mockito, JaCoCo  

---

## 1. Mục tiêu kiểm thử

Kiểm thử cấu trúc mã nguồn bên trong (White-box testing) để đảm bảo:
- **Statement Coverage (Độ bao phủ câu lệnh):** 100% các dòng code quan trọng (đặc biệt là logic tính toán, gọi database) được thực thi ít nhất 1 lần trong unit test.
- **Branch Coverage (Độ bao phủ rẽ nhánh):** 100% các điều kiện `if/else`, `switch/case` trong Service được kiểm tra cả trường hợp `true` và `false`.
- **Cyclomatic Complexity (Độ phức tạp vòng):** Xác định các hàm phức tạp (nhiều nhánh if-else) để tập trung viết test.

---

## 2. Phân tích độ phức tạp (Cyclomatic Complexity)

Dựa trên cấu trúc logic thông thường của chức năng `Create Product` trong tầng Service (`ProductService.java`):

```java
public Product createProduct(ProductRequest request, String adminToken) {
    // Branch 1: Kiểm tra quyền
    if (!authService.isAdmin(adminToken)) {
        throw new UnauthorizedException("Not admin");
    }
    
    // Branch 2: Kiểm tra Brand
    if (!brandRepository.existsById(request.getBrandId())) {
        throw new NotFoundException("Brand not found");
    }
    
    // Branch 3: Kiểm tra Category
    if (!categoryRepository.existsById(request.getCategoryId())) {
        throw new NotFoundException("Category not found");
    }

    Product product = new Product();
    // Set các trường...
    return productRepository.save(product);
}
```

**Tính toán độ phức tạp:**
- Số lượng điểm rẽ nhánh (if) = 3
- Cyclomatic Complexity (V) = Số điểm rẽ nhánh + 1 = 4.
- **Kết luận:** Hàm có độ phức tạp là 4. Ta cần ít nhất 4 test case độc lập để bao phủ (cover) toàn bộ các nhánh thực thi (Path Coverage).

---

## 3. Kịch bản Unit Test (JUnit & Mockito)

### 3.1. Test Cases cho `ProductService.createProduct`

Dựa trên việc phân tích đường dẫn (Path Analysis), ta có các Test Case sau:

| STT | Test Case Name | Mô tả (Scenario) | Mock Behavior (Hành vi giả lập) | Expected Result (Kết quả) | Loại Coverage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `createProduct_Success` | Happy path: Dữ liệu hợp lệ, User là Admin, Brand & Category tồn tại. | `isAdmin` -> `true`<br>`existsBrand` -> `true`<br>`existsCategory` -> `true`<br>`save` -> Trả về Entity | Trả về `Product` entity hợp lệ, gọi hàm `save` 1 lần. | Statement Coverage (Nhánh chính) |
| 2 | `createProduct_Fail_NotAdmin` | User không phải Admin | `isAdmin` -> `false` | Bắn ra `UnauthorizedException` | Branch Coverage (Branch 1 - false) |
| 3 | `createProduct_Fail_BrandNotFound` | BrandId truyền lên không tồn tại trong DB | `isAdmin` -> `true`<br>`existsBrand` -> `false` | Bắn ra `NotFoundException("Brand not found")` | Branch Coverage (Branch 2 - false) |
| 4 | `createProduct_Fail_CategoryNotFound`| CategoryId truyền lên không tồn tại trong DB | `isAdmin` -> `true`<br>`existsBrand` -> `true`<br>`existsCategory` -> `false`| Bắn ra `NotFoundException("Category not found")` | Branch Coverage (Branch 3 - false) |

### 3.2. Đoạn code mẫu JUnit Test (Ví dụ)

```java
@ExtendWith(MockitoExtension.class)
public class ProductServiceTest {

    @Mock
    private AuthService authService;
    @Mock
    private BrandRepository brandRepository;
    @Mock
    private CategoryRepository categoryRepository;
    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    @Test
    void createProduct_Fail_BrandNotFound() {
        // Arrange
        ProductRequest request = new ProductRequest();
        request.setBrandId(99L);
        String token = "valid_admin_token";

        when(authService.isAdmin(token)).thenReturn(true);
        when(brandRepository.existsById(99L)).thenReturn(false);

        // Act & Assert
        assertThrows(NotFoundException.class, () -> {
            productService.createProduct(request, token);
        });

        // Đảm bảo không lưu DB
        verify(productRepository, never()).save(any(Product.class));
    }
}
```

---

## 4. Mục tiêu Đo lường Code Coverage (với JaCoCo)

Để đảm bảo chất lượng, cấu hình JaCoCo trong `pom.xml` cần đạt các chỉ tiêu sau cho package `com.example.vgashop.service` và `com.example.vgashop.controller`:

- **Line Coverage:** Tối thiểu 85% (85% số dòng code được chạy qua khi test).
- **Branch Coverage:** Tối thiểu 80% (80% các nhánh if/else được kiểm tra).
- **Class Coverage:** 100% (Tất cả các class Service và Controller đều phải có ít nhất 1 file Test tương ứng).

---

## 5. Kết luận

Việc bổ sung White-box testing (Unit Test) cho tầng Service giúp phát hiện sớm các lỗi về logic kinh doanh ngay trong quá trình build code, trước khi deploy. Nó bổ trợ hoàn hảo cho bộ 56 Black-box Test Cases (được test qua API), tạo thành cấu trúc kiểm thử vững chắc cho module Product Admin.
