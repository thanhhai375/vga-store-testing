# 📖 Hướng Dẫn Sử Dụng Postman Collection - VGA AUTH USER BVA

## 📌 Quick Start (5 phút)

### 1. Import Collection & Environment vào Postman

**Bước 1: Import Collection**
```
1. Postman → File → Import
2. Chọn file: VGA_AUTH_USER_BVA.postman_collection.json
3. Nhấp "Import"
```

**Bước 2: Import Environment**
```
1. Postman → Environments (tab bên trái)
2. Nhấp nút "Import"
3. Chọn file: VGA_Store_Local.postman_environment.json
4. Nhấp "Import"
```

**Bước 3: Chọn Environment**
```
1. Góc trên phải → Dropdown Environment
2. Ch��n: "VGA Store Local"
3. Xác nhận baseUrl = http://localhost:8080
```

### 2. Chạy Setup (Login)

```
1. Mở Collection "VGA AUTH USER - BVA Testing"
2. Folder "1. 🔑 Setup - Authentication"
3. Chạy theo thứ tự:
   - TC_SETUP_01 - Register Account
   - TC_SETUP_02 - Login Account (Lấy Token)
4. Xác nhận token được save vào environment
```

### 3. Chạy Tests với CSV Data

**Cách 1: Collection Runner (Recommended)**

```
1. Chọn Collection: "VGA AUTH USER - BVA Testing"
2. Nhấp nút "Run" (góc trên cùng)
3. Cửa sổ Collection Runner mở ra
4. Chọn "Select a data file"
5. Chọn file:
   - Cho User Profile: automation/postman/VGA-AUTH-USER/UserProfile_BVA.csv
   - Cho Addresses: automation/postman/VGA-AUTH-USER/Addresses_BVA.csv
6. Iterations: 30 (hoặc số test cases)
7. Delay: 100ms (giữa các requests)
8. Nhấp "Run VGA AUTH USER - BVA Testing"
```

**Cách 2: Newman CLI**

```bash
# Chạy User Profile tests
newman run automation/postman/VGA-AUTH-USER/VGA_AUTH_USER_BVA.postman_collection.json \
  -e automation/postman/VGA-AUTH-USER/VGA_Store_Local.postman_environment.json \
  -d automation/postman/VGA-AUTH-USER/UserProfile_BVA.csv \
  --delay-request 100 \
  -r cli,json,html \
  --reporter-html-export results/UserProfile_BVA_Results.html

# Chạy Addresses tests
newman run automation/postman/VGA-AUTH-USER/VGA_AUTH_USER_BVA.postman_collection.json \
  -e automation/postman/VGA-AUTH-USER/VGA_Store_Local.postman_environment.json \
  -d automation/postman/VGA-AUTH-USER/Addresses_BVA.csv \
  --delay-request 100 \
  -r cli,json,html \
  --reporter-html-export results/Addresses_BVA_Results.html
```

---

## 🎯 Chi Tiết từng Folder

### Folder 1: Setup - Authentication

**Mục đích:** Tạo tài khoản & lấy token trước khi chạy BVA tests

#### Request 1: TC_SETUP_01 - Register Account
```
Method: POST
URL: {{baseUrl}}/api/auth/register

Body:
{
  "email": "testuser_[timestamp]@testmail.com",
  "username": "testuser_[timestamp]",
  "password": "Test@123456",
  "fullName": "Test User BVA"
}

Expected: 200 OK
Kết quả: Tài khoản được tạo, sẵn sàng login
```

#### Request 2: TC_SETUP_02 - Login Account
```
Method: POST
URL: {{baseUrl}}/api/auth/login

Body:
{
  "username": "testuser_[timestamp]",
  "password": "Test@123456"
}

Expected: 200 OK
Kết quả: Token được lưu vào {{token}}, userId được lưu vào {{userId}}

⚠️ QUAN TRỌNG: Phải chạy request này trước khi chạy BVA tests!
```

---

### Folder 2: User Profile - BVA Tests

**Mục đích:** Test Boundary Value Analysis cho PUT /api/users/profile

#### Request 1: BVA - Get Current Profile
```
Method: GET
URL: {{baseUrl}}/api/users/profile
Header: Authorization: Bearer {{token}}

Mục đích: Lấy profile hiện tại để có baseline data
Expected: 200 OK

Chạy lần này để xem structure response
```

#### Request 2: BVA - Update Profile (Data-Driven)
```
Method: PUT
URL: {{baseUrl}}/api/users/profile
Header: Authorization: Bearer {{token}}

Body Template:
{
  "fullName": "{{fullName}}",
  "phone": "{{phone}}",
  "dob": "{{dob}}",
  "gender": "{{gender}}"
}

⚠️ QUAN TRỌNG:
- Giá trị {{fullName}}, {{phone}}, {{dob}}, {{gender}} 
  sẽ được điền từ file CSV
- Collection Runner sẽ chạy request này 30 lần 
  (mỗi lần với dữ liệu từ 1 hàng CSV)

Tests được chạy:
✓ Kiểm tra status code = expectedStatus
✓ Kiểm tra response structure
✓ Log kết quả: PASS/FAIL
```

**CSV Format mong đợi:**
```
TC_ID,fullName,phone,dob,gender,expectedStatus,description
TC_UP_01,Nguyễn Văn A,0901234567,1995-06-15,MALE,200,Valid profile update - all fields
TC_UP_02,AB,0912345678,1996-06-15,MALE,200,Valid fullName - minimum 2 chars
TC_UP_11,Nguyễn Văn A,012345678,1995-06-15,MALE,400,Invalid phone - less than 10 digits
...
```

---

### Folder 3: User Addresses - BVA Tests

**Mục đích:** Test Boundary Value Analysis cho POST /api/users/addresses

#### Request 1: BVA - Add Address (Data-Driven)
```
Method: POST
URL: {{baseUrl}}/api/users/addresses
Header: Authorization: Bearer {{token}}

Body Template:
{
  "recipientName": "{{recipientName}}",
  "phone": "{{phone}}",
  "detailedAddress": "{{detailedAddress}}",
  "isDefault": {{isDefault}}
}

⚠️ QUAN TRỌNG:
- {{recipientName}}, {{phone}}, {{detailedAddress}}, {{isDefault}}
  sẽ được điền từ file CSV
- Collection Runner sẽ chạy request này 33 lần

Tests được chạy:
✓ Kiểm tra status code = expectedStatus
✓ Kiểm tra response structure
✓ Lưu addressId nếu thêm thành công
✓ Log kết quả: PASS/FAIL
```

**CSV Format mong đợi:**
```
TC_ID,recipientName,phone,detailedAddress,isDefault,expectedStatus,description
TC_ADDR_BVA_01,Trần Minh Đức,0912345678,123 Nguyễn Hữu Cảnh...,true,200,Valid address - complete data
TC_ADDR_BVA_02,AB,0912345678,123 Đường A TP.HCM,false,200,Valid recipientName - minimum 2 chars
TC_ADDR_BVA_11,Nguyễn A,031234567,123 Đường A,false,400,Invalid phone - less than 10 digits
...
```

#### Request 2: BVA - List All Addresses
```
Method: GET
URL: {{baseUrl}}/api/users/profile
Header: Authorization: Bearer {{token}}

Mục đích: Lấy danh sách địa chỉ hiện tại (addresses list nằm trong user profile)
Expected: 200 OK

Hữu ích khi:
- Muốn kiểm tra các addresses vừa thêm
- Kiểm tra isDefault flag
- Xem toàn bộ addresses của user
```

---

## 🚀 Hướng Dẫn Chạy Chi Tiết

### Scenario: Chạy tất cả 30 User Profile BVA Tests

**Bước 1: Chuẩn Bị**
```
✓ Backend chạy tại http://localhost:8080
✓ File CSV sẵn sàng: UserProfile_BVA.csv
✓ Collection & Environment đã import
✓ Environment "VGA Store Local" đã select
```

**Bước 2: Login để lấy Token**
```
1. Chọn folder "1. 🔑 Setup - Authentication"
2. Chạy: TC_SETUP_01 - Register Account
   - Xem Console → Xác nhận status 200
3. Chạy: TC_SETUP_02 - Login Account
   - Xem Console → Log "✓ Token saved: ..."
   - Xác nhận {{token}} và {{userId}} đã được set
```

**Bước 3: Chạy BVA Tests**
```
1. Chọn folder "2. 👤 User Profile - BVA Tests"
2. Nhấp nút "Run" (hoặc Ctrl+Shift+R)
3. Cửa sổ Collection Runner mở ra
4. Settings:
   - Select data file: UserProfile_BVA.csv
   - Iterations: 30
   - Delay: 100ms
   - Keep Variable Values: ✓
   - Save responses: (optional)
5. Nhấp "Run VGA AUTH USER - BVA Testing"
```

**Bước 4: Xem Kết Quả**
```
Bên phải cửa sổ Runner sẽ hiển thị:
├── Summary
│   ├── Total Requests: 30
│   ├── Passed: 28 ✓
│   ├── Failed: 2 ✗
│   └── Total Time: 5.23s
│
└── Detailed Results
    ├── TC_UP_01: ✓ PASS (200 OK, 120ms)
    ├── TC_UP_02: ✓ PASS (200 OK, 115ms)
    ├── TC_UP_11: ✓ PASS (400 Bad Request, 98ms)
    ├── TC_UP_13: ✗ FAIL (Expected 400, Got 200)
    └── ...
```

**Bước 5: Export Report**
```
1. Nhấp "Export Results" (góc phải)
2. Format: JSON hoặc HTML
3. Lưu file: results/UserProfile_BVA_Results.json
4. Xem HTML report: Mở file trong browser
```

---

## 🔧 Troubleshooting

### Lỗi 1: "Invalid authorization token"

```
Nguyên nhân: Token không được set hoặc hết hạn

Giải pháp:
1. Chạy lại TC_SETUP_02 - Login Account
2. Kiểm tra {{token}} trong environment (nên có giá trị)
3. Nếu vẫn lỗi → Xóa token cũ, login lại
```

### Lỗi 2: "Connection refused - localhost:8080"

```
Nguyên nhân: Backend không chạy

Giải pháp:
1. Khởi động backend:
   docker-compose up -d backend
2. Hoặc chạy thủ công:
   cd backend/vgashop && ./mvnw spring-boot:run
3. Đợi 10-15 giây backend khởi động
4. Test: curl http://localhost:8080/actuator/health
```

### Lỗi 3: "CSV file not found"

```
Nguyên nhân: Đường dẫn file sai

Giải pháp:
1. Kiểm tra file tồn tại:
   ls -la automation/postman/VGA-AUTH-USER/UserProfile_BVA.csv
2. Trong Collection Runner, dùng absolute path hoặc relative từ project root:
   automation/postman/VGA-AUTH-USER/UserProfile_BVA.csv
3. Hoặc browse và chọn file bằng nút "Select"
```

### Lỗi 4: "Expected 400 but got 200"

```
Nguyên nhân: Backend validation không đúng

Giải pháp:
1. Kiểm tra validation logic trong backend:
   backend/vgashop/src/main/java/.../service/UserService.java
   backend/vgashop/src/main/java/.../dto/UserProfileRequest.java
   
2. Thêm @Valid annotation:
   @PutMapping("/profile")
   public ResponseEntity<...> updateProfile(
       @Valid @RequestBody UserProfileRequest request) {
       ...
   }
   
3. Thêm validation constraints:
   @Data
   public class UserProfileRequest {
       @NotBlank(message = "fullName required")
       @Size(min = 2, max = 100)
       private String fullName;
       
       @Pattern(regexp = "^(0[3|5|7|8|9])+([0-9]{8})$",
                message = "Invalid phone format")
       private String phone;
       
       @Past(message = "DOB must be in past")
       private LocalDate dob;
   }
   
4. Re-run tests sau khi fix
```

### Lỗi 5: "Tests hang/timeout"

```
Nguyên nhân: Request quá chậm

Giải pháp:
1. Tăng timeout trong Newman:
   --timeout-request 20000 (20 giây)
   
2. Kiểm tra backend logs:
   docker-compose logs -f backend
   
3. Kiểm tra CPU/RAM:
   top / Task Manager
   
4. Chạy tests ít hơn:
   Iterations: 5 thay vì 30
```

---

## 📊 Giải Thích Chi Tiết Tests

### Test 1: Valid Profile Update (TC_UP_01)

**Input:**
```
fullName: "Nguyễn Văn A"
phone: "0901234567"
dob: "1995-06-15"
gender: "MALE"
expectedStatus: 200
```

**Request:**
```bash
curl -X PUT http://localhost:8080/api/users/profile \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Nguyễn Văn A",
    "phone": "0901234567",
    "dob": "1995-06-15",
    "gender": "MALE"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Cập nhật hồ sơ thành công",
  "data": {
    "id": 1,
    "username": "testuser_...",
    "email": "testuser_...",
    "phone": "0901234567",
    "dob": "1995-06-15",
    "gender": "MALE",
    "addresses": [...]
  }
}
```

**Test Assertions:**
```javascript
✓ Status code = 200
✓ success = true
✓ data.id exists
✓ data.phone = "0901234567"
✓ data.dob = "1995-06-15"
```

---

### Test 2: Invalid Phone Format (TC_UP_11)

**Input:**
```
phone: "012345678"  (9 chữ số - thiếu 1 chữ)
expectedStatus: 400
```

**Request:**
```bash
curl -X PUT http://localhost:8080/api/users/profile \
  -H "Authorization: Bearer <token>" \
  -d '{"phone": "012345678"}'
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Số điện thoại không hợp lệ",
  "error": "Phone must be 10 digits"
}
```

**Test Assertions:**
```javascript
✓ Status code = 400 (Nếu validation đúng)
✓ success = false
✓ message contains "phone" hoặc "digit"
```

---

### Test 3: Valid Address Add (TC_ADDR_BVA_01)

**Input:**
```
recipientName: "Trần Minh Đức"
phone: "0912345678"
detailedAddress: "123 Nguyễn Hữu Cảnh Phường Bình Thạnh..."
isDefault: true
expectedStatus: 200
```

**Request:**
```bash
curl -X POST http://localhost:8080/api/users/addresses \
  -H "Authorization: Bearer <token>" \
  -d '{
    "recipientName": "Trần Minh Đức",
    "phone": "0912345678",
    "detailedAddress": "123 Nguyễn Hữu Cảnh...",
    "isDefault": true
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Đã thêm địa chỉ",
  "data": {
    "id": 1,
    "username": "...",
    "addresses": [
      {
        "id": 1,
        "recipientName": "Trần Minh Đức",
        "phone": "0912345678",
        "detailedAddress": "123 Nguyễn Hữu Cảnh...",
        "isDefault": true
      }
    ]
  }
}
```

**Test Assertions:**
```javascript
✓ Status code = 200
✓ success = true
✓ data.addresses is array
✓ addresses[0].recipientName = "Trần Minh Đức"
✓ addressId được save vào environment
```

---

## 📈 Best Practices

### 1. Luôn chạy Setup trước
```
Nếu không chạy Setup → Không có token → Tất cả tests fail
```

### 2. Kiểm tra Console Output
```
Postman → View → Show Postman Console (Cmd/Ctrl+Alt+C)
Xem logs để debug từng test case
```

### 3. Lưu Results
```
Sau mỗi test run → Export Results
Giữ lại history để so sánh
```

### 4. Validate CSV Data
```
Trước khi chạy → Mở CSV file xem kỹ
Đảm bảo format, không có typo
```

### 5. Chạy Incremental
```
Không chạy cả 30 tests lần đầu
Bắt đầu với 5 tests → Debug
Rồi tăng dần
```

---

## 💡 Tips & Tricks

### Xem token hiện tại
```javascript
// Trong Console
console.log(pm.environment.get('token'));
```

### Debug request body
```javascript
// Trong Pre-request Script
console.log(pm.environment.get('fullName'));
console.log(pm.environment.get('phone'));
```

### Reset environment
```
Environments → VGA Store Local → Reset
Xóa toàn bộ values để bắt đầu lại
```

### Chạy single test case
```
Chọn request → Nhấp send (Ctrl+Enter)
Không cần dùng Collection Runner
```

---

## ✅ Checklist Trước Khi Chạy Tests

- [ ] Backend chạy tại http://localhost:8080
- [ ] PostgreSQL database sẵn sàng
- [ ] Collection imported vào Postman
- [ ] Environment imported vào Postman
- [ ] Environment "VGA Store Local" được select
- [ ] CSV files tồn tại:
  - [ ] UserProfile_BVA.csv
  - [ ] Addresses_BVA.csv
- [ ] Chạy Setup requests (Register + Login)
- [ ] {{token}} và {{userId}} đã được set
- [ ] Network connection ổn định

---

## 📞 Liên Hệ & Hỗ Trợ

**Lỗi Phổ Biến:**
- ❓ API endpoint sai? → Kiểm tra {{baseUrl}} trong environment
- ❓ Validation fail? → Xem backend service logic
- ❓ Tests inconsistent? → Chạy lại Setup, xóa token cũ

**Cách báo cáo lỗi:**
1. Chụp screenshot error message
2. Ghi lại test case ID (TC_ID)
3. Ghi lại actual vs expected result
4. Attach postman console log

---

**Happy Testing! 🎉**

---

*Tài liệu này được cập nhật cùng mỗi phiên bản mới của Collection*
