PS E:\CODECNTT\DU_AN\TestingVGA\vga-store-testing\automation> npx codeceptjs run --steps
>>
Global functions are deprecated. Use `import { Helper, within, session } from "codeceptjs"` instead. Set `noGlobals: true` in config to disable globals.
CodeceptJS v4.0.7 #StandWithUkraine
Using test root "E:\CODECNTT\DU_AN\TestingVGA\vga-store-testing\automation"

Login - Authentication --
E:\CODECNTT\DU_AN\TestingVGA\vga-store-testing\automation\E2E\modules\1_Auth\login_test.js
  Kiểm thử Đăng nhập các trường hợp lỗi | {"testId":"L-002","username":"","password":"123456","expectedMessage":"Tên đăng nhập không được trống"}
  Before()
    I am on page "/"
    I wait for element "button[title="Đăng nhập"]", 10
    I force click "button[title="Đăng nhập"]"
    I wait for visible ".auth-submit-btn", 5

  Scenario()
    I fill field "input[placeholder="Nhập mật khẩu"]", "123456"
    I force click ".auth-submit-btn"
    I see "Tên đăng nhập không được trống"
  × FAILED in 2479ms

  Kiểm thử Đăng nhập các trường hợp lỗi | {"testId":"L-003","username":"hai123","password":"","expectedMessage":"Mật khẩu không được trống"}
  Before()
    I am on page "/"
    I wait for element "button[title="Đăng nhập"]", 10
    I force click "button[title="Đăng nhập"]"
    I wait for visible ".auth-submit-btn", 5

  Scenario()
    I fill field "input[placeholder="Nhập tài khoản hoặc email"]", "h...
    I force click ".auth-submit-btn"
    I see "Mật khẩu không được trống"
  × FAILED in 1485ms

  Kiểm thử Đăng nhập các trường hợp lỗi | {"testId":"L-006","username":"ab","password":"123456","expectedMessage":"User không tồn tại"}
  Before()
    I am on page "/"
    I wait for element "button[title="Đăng nhập"]", 10
    I force click "button[title="Đăng nhập"]"
    I wait for visible ".auth-submit-btn", 5

  Scenario()
    I fill field "input[placeholder="Nhập tài khoản hoặc email"]", "a...
    I fill field "input[placeholder="Nhập mật khẩu"]", "123456"
    I force click ".auth-submit-btn"
    I see "User không tồn tại"
  × FAILED in 1961ms

  Kiểm thử Đăng nhập các trường hợp lỗi | {"testId":"L-010","username":"hai123","password":"12345","expectedMessage":"Sai mật khẩu"}
  Before()
    I am on page "/"
    I wait for element "button[title="Đăng nhập"]", 10
    I force click "button[title="Đăng nhập"]"
    I wait for visible ".auth-submit-btn", 5

  Scenario()
    I fill field "input[placeholder="Nhập tài khoản hoặc email"]", "h...
    I fill field "input[placeholder="Nhập mật khẩu"]", "12345"
    I force click ".auth-submit-btn"
    I see "Sai mật khẩu"
  × FAILED in 4276ms

  Kiểm thử Đăng nhập các trường hợp lỗi | {"testId":"L-013","username":"usernotexist999","password":"123456","expectedMessage":"Invalid username or password"}
  Before()
    I am on page "/"
    I wait for element "button[title="Đăng nhập"]", 10
    I force click "button[title="Đăng nhập"]"
    I wait for visible ".auth-submit-btn", 5

  Scenario()
    I fill field "input[placeholder="Nhập tài khoản hoặc email"]", "u...
    I fill field "input[placeholder="Nhập mật khẩu"]", "123456"
    I force click ".auth-submit-btn"
    I see "Invalid username or password"
  × FAILED in 1859ms

  L-001: Đăng nhập thành công
  Before()
    I am on page "/"
    I wait for element "button[title="Đăng nhập"]", 10
    I force click "button[title="Đăng nhập"]"
    I wait for visible ".auth-submit-btn", 5

  Scenario()
    I fill field "input[placeholder="Nhập tài khoản hoặc email"]", "h...
    I fill field "input[placeholder="Nhập mật khẩu"]", "hai123"
    I force click ".auth-submit-btn"
  √ OK in 698ms

Register - Authentication --
E:\CODECNTT\DU_AN\TestingVGA\vga-store-testing\automation\E2E\modules\1_Auth\register_test.js
  Kiểm thử Đăng ký các trường hợp lỗi | {"testId":"R-002","username":"","email":"r002_empty_user@gmail.com","password":"pass123456","fullName":"User Name","expectedMessage":"Tên đăng nhập không được trống"}
  Before()
    I am on page "/"
    I wait for element "button[title="Đăng nhập"]", 10
    I force click "button[title="Đăng nhập"]"
    I wait for visible ".auth-modal", 5
    I force click "//button[contains(@class, "auth-tab") and text()="...
    I wait for visible ".auth-submit-btn", 5

  Scenario()
    I fill field "input[placeholder="Nhập email của bạn"]", "r002_emp...
    I fill field "input[placeholder="Nhập mật khẩu"]", "pass123456"

 fill field "input[placeholder="Nhập họ và tên của bạn"]", "User...
    I force click ".auth-submit-btn"
    I see "Tên đăng nhập không được trống"
  × FAILED in 5334ms

  Kiểm thử Đăng ký các trường hợp lỗi | {"testId":"R-003","username":"r003_user","email":"","password":"pass123456","fullName":"User Name","expectedMessage":"Email không được trống"}
  Before()
    I am on page "/"
    I wait for element "button[title="Đăng nhập"]", 10
    I force click "button[title="Đăng nhập"]"
    I wait for visible ".auth-modal", 5
    I force click "//button[contains(@class, "auth-tab") and text()="...
    I wait for visible ".auth-submit-btn", 5

  Scenario()
    I fill field "input[placeholder="Nhập tên đăng nhập"]", "r003_use...
    I fill field "input[placeholder="Nhập mật khẩu"]", "pass123456"

 fill field "input[placeholder="Nhập họ và tên của bạn"]", "User...
    I force click ".auth-submit-btn"
    I see "Email không được trống"
  × FAILED in 4370ms

  Kiểm thử Đăng ký các trường hợp lỗi | {"testId":"R-004","username":"r004_user","email":"r004_empty_pass@gmail.com","password":"","fullName":"User Name","expectedMessage":"Mật khẩu không được trống"}
  Before()
    I am on page "/"
    I wait for element "button[title="Đăng nhập"]", 10
    I force click "button[title="Đăng nhập"]"
    I wait for visible ".auth-modal", 5
    I force click "//button[contains(@class, "auth-tab") and text()="...
    I wait for visible ".auth-submit-btn", 5

  Scenario()
    I fill field "input[placeholder="Nhập tên đăng nhập"]", "r004_use...
    I fill field "input[placeholder="Nhập email của bạn"]", "r004_emp...
    I fill field "input[placeholder="Nhập họ và tên của bạn"]", "User...
    I force click ".auth-submit-btn"
    I see "Mật khẩu không được trống"
  × FAILED in 6103ms

  Kiểm thử Đăng ký các trường hợp lỗi | {"testId":"R-006","username":"ab","email":"r006_short_user@gmail.com","password":"pass123456","fullName":"User Name","expectedMessage":"Tên đăng nhập từ 3-50 ký tự"}
  Before()
    I am on page "/"
    I wait for element "button[title="Đăng nhập"]", 10
    I force click "button[title="Đăng nhập"]"
    I wait for visible ".auth-modal", 5
    I force click "//button[contains(@class, "auth-tab") and text()="...
    I wait for visible ".auth-submit-btn", 5

  Scenario()
    I fill field "input[placeholder="Nhập tên đăng nhập"]", "ab"
    I fill field "input[placeholder="Nhập email của bạn"]", "r006_sho...
    I fill field "input[placeholder="Nhập mật khẩu"]", "pass123456"

 fill field "input[placeholder="Nhập họ và tên của bạn"]", "User...
    I force click ".auth-submit-btn"
    I see "Tên đăng nhập từ 3-50 ký tự"
  × FAILED in 3240ms

  Kiểm thử Đăng ký các trường hợp lỗi | {"testId":"R-010","username":"r010_user","email":"invalidgmail","password":"pass123456","fullName":"User Name","expectedMessage":"Email không hợp lệ"}
  Before()
    I am on page "/"
    I wait for element "button[title="Đăng nhập"]", 10
    I force click "button[title="Đăng nhập"]"
    I wait for visible ".auth-modal", 5
    I force click "//button[contains(@class, "auth-tab") and text()="...
    I wait for visible ".auth-submit-btn", 5

  Scenario()
    I fill field "input[placeholder="Nhập tên đăng nhập"]", "r010_use...
    I fill field "input[placeholder="Nhập email của bạn"]", "invalidg...
    I fill field "input[placeholder="Nhập mật khẩu"]", "pass123456"

 fill field "input[placeholder="Nhập họ và tên của bạn"]", "User...
    I force click ".auth-submit-btn"
    I see "Email không hợp lệ"
  × FAILED in 3507ms

  Kiểm thử Đăng ký các trường hợp lỗi | {"testId":"R-012","username":"hai123","email":"r012_taken@gmail.com","password":"pass123456","fullName":"Another User","expectedMessage":"Username is already taken"}
  Before()
    I am on page "/"
    I wait for element "button[title="Đăng nhập"]", 10
    I force click "button[title="Đăng nhập"]"
    I wait for visible ".auth-modal", 5
    I force click "//button[contains(@class, "auth-tab") and text()="...
    I wait for visible ".auth-submit-btn", 5

  Scenario()
    I fill field "input[placeholder="Nhập tên đăng nhập"]", "hai123"

 fill field "input[placeholder="Nhập email của bạn"]", "r012_tak...
    I fill field "input[placeholder="Nhập mật khẩu"]", "pass123456"

 fill field "input[placeholder="Nhập họ và tên của bạn"]", "Anot...
    I force click ".auth-submit-btn"
    I see "Username is already taken"
  × FAILED in 3491ms

  R-001: Đăng ký thành công
  Before()
    I am on page "/"
    I wait for element "button[title="Đăng nhập"]", 10
    I force click "button[title="Đăng nhập"]"
    I wait for visible ".auth-modal", 5
    I force click "//button[contains(@class, "auth-tab") and text()="...
    I wait for visible ".auth-submit-btn", 5

  Scenario()
    I fill field "input[placeholder="Nhập tên đăng nhập"]", "user_178...
    I fill field "input[placeholder="Nhập email của bạn"]", "email_17...
    I fill field "input[placeholder="Nhập mật khẩu"]", "pass123456"

 fill field "input[placeholder="Nhập họ và tên của bạn"]", "Test...
    I force click ".auth-submit-btn"
  √ OK in 2039ms


-- FAILURES:

  1) Login - Authentication
       Kiểm thử Đăng nhập các trường hợp lỗi | {"testId":"L-002","username":"","password":"123456","expectedMessage":"Tên đăng nhập không được trống"}:

      expected web application to include "Tên đăng nhập không được trống"
      + expected - actual

      -TRANG CHỦ SẢN PHẨM TIN TỨC DỊCH VỤ ĐĂNG NHẬP ĐĂNG KÝ Tài khoản / Email Mật khẩu Ghi nhớ đăng nhập Quên mật khẩu? ĐĂNG NHẬP Hoặc đăng nhập bằng Google Facebook CARD ĐỒ HỌA PHỤ KIỆN CARD ĐỒ HỌA XEM TẤT CẢ CARD ĐỒ HỌA › ROG MATRIX Tản Nhiệt Vô Cực XEM THÊM › ROG ASTRAL Tiên Phong Công Nghệ XEM THÊM › ROG STRIX Thống Lĩnh Cuộc Chơi XEM THÊM › GIÚP TÔI LỰA CHỌN Hãy cho chúng tôi biết bạn đang cần gì. Chúng tôi sẽ giúp bạn chọn sản phẩm phù hợp. THƯƠNG HIỆU ASUS GIGABYTE MSI HÃNG CHIPSET NVIDIA AMD Intel CẤU HÌNH CHIPSET RTX 4090 RTX 4080 RTX 4070 RTX 3060 RX 7900 DUNG LƯỢNG VRAM 24GB 16GB 12GB 8GB LOẠI BỘ NHỚ GDDR6X GDDR6 GDDR5 DÒNG SẢN PHẨM ROG TUF Dual Gaming X PSU ĐỀ XUẤT 1000W 850W 750W 650W MỨC GIÁ Dưới 10 triệu Từ 10 - 20 triệu Từ 20 - 40 triệu Trên 40 triệu XEM SẢN PHẨM PHÙ HỢP PHỤ KIỆN XEM TẤT CẢ PHỤ KIỆN › ROG Herculx EVA-02 Edition Phiên bản ROG Herculx EVA-02 mạnh mẽ sẽ củng cố một cách an toàn ngay cả những card mạnh nhất, đồng thời mang đến thiết ... ROG Herculx Graphics Card Holder Giá đỡ card đồ họa ROG Herculx có thể đỡ chắc chắn và an toàn cả những card mạnh và to nạc nhất, đồng thời có thiết kế d... Chuyên cung cấp Card đồ họa chính hãng. Bảo hành uy tín — Giao hàng toàn quốc. Cập nhật sau Cập nhật sau 8:00 – 21:00 mỗi ngày VỀ CHÚNG TÔI Giới thiệu VGA Store Hệ thống Showroom Dịch vụ kỹ thuật tại nhà Thu cũ đổi mới CHÍNH SÁCH Chính sách Bảo hành Chính sách Giao hàng Mua trả góp 0% Hướng dẫn Thanh toán Hướng dẫn Đặt hàng NHẬN ƯU ĐÃI Đăng ký nhận khuyến mãi & sản phẩm mới nhất. ĐĂNG KÝ © 2025 VGA Store. Tất cả quyền được bảo lưu. Chính sách Bảo mật Tra cứu Đơn hàng
      +Tên đăng nhập không được trống




  ( ) File: file://E:\CODECNTT\DU_AN\TestingVGA\vga-store-testing\automation\E2E\modules\1_Auth\login_test.js

  ( ) Scenario Steps:
  × I.see("Tên đăng nhập không được trống") at Test.<anonymous> (.\E2E\modules\1_Auth\login_test.js:29:5)
  √ I.forceClick(".auth-submit-btn") at Test.<anonymous> (.\E2E\modules\1_Auth\login_test.js:28:5)
  √ I.fillField("input[placeholder="Nhập mật khẩu"]", "123456") at Test.<anonymous> (.\E2E\modules\1_Auth\login_test.js:25:7)

  ( ) Artifacts:
  - screenshot: E:\CODECNTT\DU_AN\TestingVGA\vga-store-testing\automation\E2E\output\Kiểm_thử_Đăng_nhập_các_trường_hợp_lỗi.failed.png

  ( ) Metadata:
  - browser: chromium
  - browserVersion: 149.0.7827.55
  - windowSize: 1280x720

  2) Login - Authentication
       Kiểm thử Đăng nhập các trường hợp lỗi | {"testId":"L-003","username":"hai123","password":"","expectedMessage":"Mật khẩu không được trống"}:

      expected web application to include "Mật khẩu không được trống"
      + expected - actual

      -TRANG CHỦ SẢN PHẨM TIN TỨC DỊCH VỤ ĐĂNG NHẬP ĐĂNG KÝ Tài khoản / Email Mật khẩu Ghi nhớ đăng nhập Quên mật khẩu? ĐĂNG NHẬP Hoặc đăng nhập bằng Google Facebook CARD ĐỒ HỌA PHỤ KIỆN CARD ĐỒ HỌA XEM TẤT CẢ CARD ĐỒ HỌA › ROG MATRIX Tản Nhiệt Vô Cực XEM THÊM › ROG ASTRAL Tiên Phong Công Nghệ XEM THÊM › ROG STRIX Thống Lĩnh Cuộc Chơi XEM THÊM › GIÚP TÔI LỰA CHỌN Hãy cho chúng tôi biết bạn đang cần gì. Chúng tôi sẽ giúp bạn chọn sản phẩm phù hợp. THƯƠNG HIỆU ASUS GIGABYTE MSI HÃNG CHIPSET NVIDIA AMD Intel CẤU HÌNH CHIPSET RTX 4090 RTX 4080 RTX 4070 RTX 3060 RX 7900 DUNG LƯỢNG VRAM 24GB 16GB 12GB 8GB LOẠI BỘ NHỚ GDDR6X GDDR6 GDDR5 DÒNG SẢN PHẨM ROG TUF Dual Gaming X PSU ĐỀ XUẤT 1000W 850W 750W 650W MỨC GIÁ Dưới 10 triệu Từ 10 - 20 triệu Từ 20 - 40 triệu Trên 40 triệu XEM SẢN PHẨM PHÙ HỢP PHỤ KIỆN XEM TẤT CẢ PHỤ KIỆN › ROG Herculx EVA-02 Edition Phiên bản ROG Herculx EVA-02 mạnh mẽ sẽ củng cố một cách an toàn ngay cả những card mạnh nhất, đồng thời mang đến thiết ... ROG Herculx Graphics Card Holder Giá đỡ card đồ họa ROG Herculx có thể đỡ chắc chắn và an toàn cả những card mạnh và to nạc nhất, đồng thời có thiết kế d... Chuyên cung cấp Card đồ họa chính hãng. Bảo hành uy tín — Giao hàng toàn quốc. Cập nhật sau Cập nhật sau 8:00 – 21:00 mỗi ngày VỀ CHÚNG TÔI Giới thiệu VGA Store Hệ thống Showroom Dịch vụ kỹ thuật tại nhà Thu cũ đổi mới CHÍNH SÁCH Chính sách Bảo hành Chính sách Giao hàng Mua trả góp 0% Hướng dẫn Thanh toán Hướng dẫn Đặt hàng NHẬN ƯU ĐÃI Đăng ký nhận khuyến mãi & sản phẩm mới nhất. ĐĂNG KÝ © 2025 VGA Store. Tất cả quyền được bảo lưu. Chính sách Bảo mật Tra cứu Đơn hàng
      +Mật khẩu không được trống




  ( ) File: file://E:\CODECNTT\DU_AN\TestingVGA\vga-store-testing\automation\E2E\modules\1_Auth\login_test.js

  ( ) Scenario Steps:
  × I.see("Mật khẩu không được trống") at Test.<anonymous> (.\E2E\modules\1_Auth\login_test.js:29:5)
  √ I.forceClick(".auth-submit-btn") at Test.<anonymous> (.\E2E\modules\1_Auth\login_test.js:28:5)
  √ I.fillField("input[placeholder="Nhập tài khoản hoặc email"]", "hai123") at Test.<anonymous> (.\E2E\modules\1_Auth\login_test.js:22:7)

  ( ) Artifacts:
  - screenshot: E:\CODECNTT\DU_AN\TestingVGA\vga-store-testing\automation\E2E\output\Kiểm_thử_Đăng_nhập_các_trường_hợp_lỗi.failed.png

  ( ) Metadata:
  - browser: chromium
  - browserVersion: 149.0.7827.55
  - windowSize: 1280x720

  3) Login - Authentication
       Kiểm thử Đăng nhập các trường hợp lỗi | {"testId":"L-006","username":"ab","password":"123456","expectedMessage":"User không tồn tại"}:

      expected web application to include "User không tồn tại"
      + expected - actual

      -TRANG CHỦ SẢN PHẨM TIN TỨC DỊCH VỤ ĐĂNG NHẬP ĐĂNG KÝ Tài khoản / Email Mật khẩu Ghi nhớ đăng nhập Quên mật khẩu? ĐĂNG NHẬP Hoặc đăng nhập bằng Google Facebook CARD ĐỒ HỌA PHỤ KIỆN CARD ĐỒ HỌA XEM TẤT CẢ CARD ĐỒ HỌA › ROG MATRIX Tản Nhiệt Vô Cực XEM THÊM › ROG ASTRAL Tiên Phong Công Nghệ XEM THÊM › ROG STRIX Thống Lĩnh Cuộc Chơi XEM THÊM › GIÚP TÔI LỰA CHỌN Hãy cho chúng tôi biết bạn đang cần gì. Chúng tôi sẽ giúp bạn chọn sản phẩm phù hợp. THƯƠNG HIỆU ASUS GIGABYTE MSI HÃNG CHIPSET NVIDIA AMD Intel CẤU HÌNH CHIPSET RTX 4090 RTX 4080 RTX 4070 RTX 3060 RX 7900 DUNG LƯỢNG VRAM 24GB 16GB 12GB 8GB LOẠI BỘ NHỚ GDDR6X GDDR6 GDDR5 DÒNG SẢN PHẨM ROG TUF Dual Gaming X PSU ĐỀ XUẤT 1000W 850W 750W 650W MỨC GIÁ Dưới 10 triệu Từ 10 - 20 triệu Từ 20 - 40 triệu Trên 40 triệu XEM SẢN PHẨM PHÙ HỢP PHỤ KIỆN XEM TẤT CẢ PHỤ KIỆN › ROG Herculx EVA-02 Edition Phiên bản ROG Herculx EVA-02 mạnh mẽ sẽ củng cố một cách an toàn ngay cả những card mạnh nhất, đồng thời mang đến thiết ... ROG Herculx Graphics Card Holder Giá đỡ card đồ họa ROG Herculx có thể đỡ chắc chắn và an toàn cả những card mạnh và to nạc nhất, đồng thời có thiết kế d... Chuyên cung cấp Card đồ họa chính hãng. Bảo hành uy tín — Giao hàng toàn quốc. Cập nhật sau Cập nhật sau 8:00 – 21:00 mỗi ngày VỀ CHÚNG TÔI Giới thiệu VGA Store Hệ thống Showroom Dịch vụ kỹ thuật tại nhà Thu cũ đổi mới CHÍNH SÁCH Chính sách Bảo hành Chính sách Giao hàng Mua trả góp 0% Hướng dẫn Thanh toán Hướng dẫn Đặt hàng NHẬN ƯU ĐÃI Đăng ký nhận khuyến mãi & sản phẩm mới nhất. ĐĂNG KÝ © 2025 VGA Store. Tất cả quyền được bảo lưu. Chính sách Bảo mật Tra cứu Đơn hàng Network Error
      +User không tồn tại




  ( ) File: file://E:\CODECNTT\DU_AN\TestingVGA\vga-store-testing\automation\E2E\modules\1_Auth\login_test.js

  ( ) Scenario Steps:
  × I.see("User không tồn tại") at Test.<anonymous> (.\E2E\modules\1_Auth\login_test.js:29:5)
  √ I.forceClick(".auth-submit-btn") at Test.<anonymous> (.\E2E\modules\1_Auth\login_test.js:28:5)
  √ I.fillField("input[placeholder="Nhập mật khẩu"]", "123456") at Test.<anonymous> (.\E2E\modules\1_Auth\login_test.js:25:7)
  √ I.fillField("input[placeholder="Nhập tài khoản hoặc email"]", "ab") at Test.<anonymous> (.\E2E\modules\1_Auth\login_test.js:22:7)

  ( ) Artifacts:
  - screenshot: E:\CODECNTT\DU_AN\TestingVGA\vga-store-testing\automation\E2E\output\Kiểm_thử_Đăng_nhập_các_trường_hợp_lỗi.failed.png

  ( ) Metadata:
  - browser: chromium
  - browserVersion: 149.0.7827.55
  - windowSize: 1280x720

  4) Login - Authentication
       Kiểm thử Đăng nhập các trường hợp lỗi | {"testId":"L-010","username":"hai123","password":"12345","expectedMessage":"Sai mật khẩu"}:

      expected web application to include "Sai mật khẩu"
      + expected - actual

      -TRANG CHỦ SẢN PHẨM TIN TỨC DỊCH VỤ ĐĂNG NHẬP ĐĂNG KÝ Tài khoản / Email Mật khẩu Ghi nhớ đăng nhập Quên mật khẩu? Đang xử lý... Hoặc đăng nhập bằng Google Facebook CARD ĐỒ HỌA PHỤ KIỆN CARD ĐỒ HỌA XEM TẤT CẢ CARD ĐỒ HỌA › ROG MATRIX Tản Nhiệt Vô Cực XEM THÊM › ROG ASTRAL Tiên Phong Công Nghệ XEM THÊM › ROG STRIX Thống Lĩnh Cuộc Chơi XEM THÊM › GIÚP TÔI LỰA CHỌN Hãy cho chúng tôi biết bạn đang cần gì. Chúng tôi sẽ giúp bạn chọn sản phẩm phù hợp. THƯƠNG HIỆU ASUS GIGABYTE MSI HÃNG CHIPSET NVIDIA AMD Intel CẤU HÌNH CHIPSET RTX 4090 RTX 4080 RTX 4070 RTX 3060 RX 7900 DUNG LƯỢNG VRAM 24GB 16GB 12GB 8GB LOẠI BỘ NHỚ GDDR6X GDDR6 GDDR5 DÒNG SẢN PHẨM ROG TUF Dual Gaming X PSU ĐỀ XUẤT 1000W 850W 750W 650W MỨC GIÁ Dưới 10 triệu Từ 10 - 20 triệu Từ 20 - 40 triệu Trên 40 triệu XEM SẢN PHẨM PHÙ HỢP PHỤ KIỆN XEM TẤT CẢ PHỤ KIỆN › ROG Herculx EVA-02 Edition Phiên bản ROG Herculx EVA-02 mạnh mẽ sẽ củng cố một cách an toàn ngay cả những card mạnh nhất, đồng thời mang đến thiết ... ROG Herculx Graphics Card Holder Giá đỡ card đồ họa ROG Herculx có thể đỡ chắc chắn và an toàn cả những card mạnh và to nạc nhất, đồng thời có thiết kế d... Chuyên cung cấp Card đồ họa chính hãng. Bảo hành uy tín — Giao hàng toàn quốc. Cập nhật sau Cập nhật sau 8:00 – 21:00 mỗi ngày VỀ CHÚNG TÔI Giới thiệu VGA Store Hệ thống Showroom Dịch vụ kỹ thuật tại nhà Thu cũ đổi mới CHÍNH SÁCH Chính sách Bảo hành Chính sách Giao hàng Mua trả góp 0% Hướng dẫn Thanh toán Hướng dẫn Đặt hàng NHẬN ƯU ĐÃI Đăng ký nhận khuyến mãi & sản phẩm mới nhất. ĐĂNG KÝ © 2025 VGA Store. Tất cả quyền được bảo lưu. Chính sách Bảo mật Tra cứu Đơn hàng
      +Sai mật khẩu




  ( ) File: file://E:\CODECNTT\DU_AN\TestingVGA\vga-store-testing\automation\E2E\modules\1_Auth\login_test.js

  ( ) Scenario Steps:
  × I.see("Sai mật khẩu") at Test.<anonymous> (.\E2E\modules\1_Auth\login_test.js:29:5)
  √ I.forceClick(".auth-submit-btn") at Test.<anonymous> (.\E2E\modules\1_Auth\login_test.js:28:5)
  √ I.fillField("input[placeholder="Nhập mật khẩu"]", "12345") at Test.<anonymous> (.\E2E\modules\1_Auth\login_test.js:25:7)
  √ I.fillField("input[placeholder="Nhập tài khoản hoặc email"]", "hai123") at Test.<anonymous> (.\E2E\modules\1_Auth\login_test.js:22:7)

  ( ) Artifacts:
  - screenshot: E:\CODECNTT\DU_AN\TestingVGA\vga-store-testing\automation\E2E\output\Kiểm_thử_Đăng_nhập_các_trường_hợp_lỗi.failed.png

  ( ) Metadata:
  - browser: chromium
  - browserVersion: 149.0.7827.55
  - windowSize: 1280x720

  5) Login - Authentication
       Kiểm thử Đăng nhập các trường hợp lỗi | {"testId":"L-013","username":"usernotexist999","password":"123456","expectedMessage":"Invalid username or password"}:    

      expected web application to include "Invalid username or password"
      + expected - actual

      -TRANG CHỦ SẢN PHẨM TIN TỨC DỊCH VỤ ĐĂNG NHẬP ĐĂNG KÝ Tài khoản / Email Mật khẩu Ghi nhớ đăng nhập Quên mật khẩu? ĐĂNG NHẬP Hoặc đăng nhập bằng Google Facebook CARD ĐỒ HỌA PHỤ KIỆN CARD ĐỒ HỌA XEM TẤT CẢ CARD ĐỒ HỌA › ROG MATRIX Tản Nhiệt Vô Cực XEM THÊM › ROG ASTRAL Tiên Phong Công Nghệ XEM THÊM › ROG STRIX Thống Lĩnh Cuộc Chơi XEM THÊM › GIÚP TÔI LỰA CHỌN Hãy cho chúng tôi biết bạn đang cần gì. Chúng tôi sẽ giúp bạn chọn sản phẩm phù hợp. THƯƠNG HIỆU ASUS GIGABYTE MSI HÃNG CHIPSET NVIDIA AMD Intel CẤU HÌNH CHIPSET RTX 4090 RTX 4080 RTX 4070 RTX 3060 RX 7900 DUNG LƯỢNG VRAM 24GB 16GB 12GB 8GB LOẠI BỘ NHỚ GDDR6X GDDR6 GDDR5 DÒNG SẢN PHẨM ROG TUF Dual Gaming X PSU ĐỀ XUẤT 1000W 850W 750W 650W MỨC GIÁ Dưới 10 triệu Từ 10 - 20 triệu Từ 20 - 40 triệu Trên 40 triệu XEM SẢN PHẨM PHÙ HỢP PHỤ KIỆN XEM TẤT CẢ PHỤ KIỆN › ROG Herculx EVA-02 Edition Phiên bản ROG Herculx EVA-02 mạnh mẽ sẽ củng cố một cách an toàn ngay cả những card mạnh nhất, đồng thời mang đến thiết ... ROG Herculx Graphics Card Holder Giá đỡ card đồ họa ROG Herculx có thể đỡ chắc chắn và an toàn cả những card mạnh và to nạc nhất, đồng thời có thiết kế d... Chuyên cung cấp Card đồ họa chính hãng. Bảo hành uy tín — Giao hàng toàn quốc. Cập nhật sau Cập nhật sau 8:00 – 21:00 mỗi ngày VỀ CHÚNG TÔI Giới thiệu VGA Store Hệ thống Showroom Dịch vụ kỹ thuật tại nhà Thu cũ đổi mới CHÍNH SÁCH Chính sách Bảo hành Chính sách Giao hàng Mua trả góp 0% Hướng dẫn Thanh toán Hướng dẫn Đặt hàng NHẬN ƯU ĐÃI Đăng ký nhận khuyến mãi & sản phẩm mới nhất. ĐĂNG KÝ © 2025 VGA Store. Tất cả quyền được bảo lưu. Chính sách Bảo mật Tra cứu Đơn hàng Network Error
      +Invalid username or password




  ( ) File: file://E:\CODECNTT\DU_AN\TestingVGA\vga-store-testing\automation\E2E\modules\1_Auth\login_test.js

  ( ) Scenario Steps:
  × I.see("Invalid username or password") at Test.<anonymous> (.\E2E\modules\1_Auth\login_test.js:29:5)
  √ I.forceClick(".auth-submit-btn") at Test.<anonymous> (.\E2E\modules\1_Auth\login_test.js:28:5)
  √ I.fillField("input[placeholder="Nhập mật khẩu"]", "123456") at Test.<anonymous> (.\E2E\modules\1_Auth\login_test.js:25:7)
  √ I.fillField("input[placeholder="Nhập tài khoản hoặc email"]", "usernotexist999") at Test.<anonymous> (.\E2E\modules\1_Auth\login_test.js:22:7)

  ( ) Artifacts:
  - screenshot: E:\CODECNTT\DU_AN\TestingVGA\vga-store-testing\automation\E2E\output\Kiểm_thử_Đăng_nhập_các_trường_hợp_lỗi.failed.png

  ( ) Metadata:
  - browser: chromium
  - browserVersion: 149.0.7827.55
  - windowSize: 1280x720

  6) Register - Authentication
       Kiểm thử Đăng ký các trường hợp lỗi | {"testId":"R-002","username":"","email":"r002_empty_user@gmail.com","password":"pass123456","fullName":"User Name","expectedMessage":"Tên đăng nhập không được trống"}:

      expected web application to include "Tên đăng nhập không được trống"
      + expected - actual

      -TRANG CHỦ SẢN PHẨM TIN TỨC DỊCH VỤ ĐĂNG NHẬP ĐĂNG KÝ Tên đăng nhập Họ và Tên Email Mật khẩu TẠO TÀI KHOẢN Hoặc đăng nhập bằng Google Facebook CARD ĐỒ HỌA PHỤ KIỆN CARD ĐỒ HỌA XEM TẤT CẢ CARD ĐỒ HỌA › ROG MATRIX Tản Nhiệt Vô Cực XEM THÊM › ROG ASTRAL Tiên Phong Công Nghệ XEM THÊM › ROG STRIX Thống Lĩnh Cuộc Chơi XEM THÊM › GIÚP TÔI LỰA CHỌN Hãy cho chúng tôi biết bạn đang cần gì. Chúng tôi sẽ giúp bạn chọn sản phẩm phù hợp. THƯƠNG HIỆU ASUS GIGABYTE MSI HÃNG CHIPSET NVIDIA AMD Intel CẤU HÌNH CHIPSET RTX 4090 RTX 4080 RTX 4070 RTX 3060 RX 7900 DUNG LƯỢNG VRAM 24GB 16GB 12GB 8GB LOẠI BỘ NHỚ GDDR6X GDDR6 GDDR5 DÒNG SẢN PHẨM ROG TUF Dual Gaming X PSU ĐỀ XUẤT 1000W 850W 750W 650W MỨC GIÁ Dưới 10 triệu Từ 10 - 20 triệu Từ 20 - 40 triệu Trên 40 triệu XEM SẢN PHẨM PHÙ HỢP PHỤ KIỆN XEM TẤT CẢ PHỤ KIỆN › ROG Herculx EVA-02 Edition Phiên bản ROG Herculx EVA-02 mạnh mẽ sẽ củng cố một cách an toàn ngay cả những card mạnh nhất, đồng thời mang đến thiết ... ROG Herculx Graphics Card Holder Giá đỡ card đồ họa ROG Herculx có thể đỡ chắc chắn và an toàn cả những card mạnh và to nạc nhất, đồng thời có thiết kế d... Chuyên cung cấp Card đồ họa chính hãng. Bảo hành uy tín — Giao hàng toàn quốc. Cập nhật sau Cập nhật sau 8:00 – 21:00 mỗi ngày VỀ CHÚNG TÔI Giới thiệu VGA Store Hệ thống Showroom Dịch vụ kỹ thuật tại nhà Thu cũ đổi mới CHÍNH SÁCH Chính sách Bảo hành Chính sách Giao hàng Mua trả góp 0% Hướng dẫn Thanh toán Hướng dẫn Đặt hàng NHẬN ƯU ĐÃI Đăng ký nhận khuyến mãi & sản phẩm mới nhất. ĐĂNG KÝ © 2025 VGA Store. Tất cả quyền được bảo lưu. Chính sách Bảo mật Tra cứu Đơn hàng 👋 Chào bạn, bạn cần tư vấn mua linh kiện gì không? ✕
      +Tên đăng nhập không được trống




  ( ) File: file://E:\CODECNTT\DU_AN\TestingVGA\vga-store-testing\automation\E2E\modules\1_Auth\register_test.js

  ( ) Scenario Steps:
  × I.see("Tên đăng nhập không được trống") at Test.<anonymous> (.\E2E\modules\1_Auth\register_test.js:34:5)
  √ I.forceClick(".auth-submit-btn") at Test.<anonymous> (.\E2E\modules\1_Auth\register_test.js:33:5)
  √ I.fillField("input[placeholder="Nhập họ và tên của bạn"]", "User Name") at Test.<anonymous> (.\E2E\modules\1_Auth\register_test.js:31:27)
  √ I.fillField("input[placeholder="Nhập mật khẩu"]", "pass123456") at Test.<anonymous> (.\E2E\modules\1_Auth\register_test.js:30:27)
  √ I.fillField("input[placeholder="Nhập email của bạn"]", "r002_empty_user@gmail.com") at Test.<anonymous> (.\E2E\modules\1_Auth\register_test.js:29:24)

  ( ) Artifacts:
  - screenshot: E:\CODECNTT\DU_AN\TestingVGA\vga-store-testing\automation\E2E\output\Kiểm_thử_Đăng_ký_các_trường_hợp_lỗi.failed.png

  ( ) Metadata:
  - browser: chromium
  - browserVersion: 149.0.7827.55
  - windowSize: 1280x720

  7) Register - Authentication
       Kiểm thử Đăng ký các trường hợp lỗi | {"testId":"R-003","username":"r003_user","email":"","password":"pass123456","fullName":"User Name","expectedMessage":"Email không được trống"}:

      expected web application to include "Email không được trống"
      + expected - actual

      -TRANG CHỦ SẢN PHẨM TIN TỨC DỊCH VỤ ĐĂNG NHẬP ĐĂNG KÝ Tên đăng nhập Họ và Tên Email Mật khẩu TẠO TÀI KHOẢN Hoặc đăng nhập bằng Google Facebook CARD ĐỒ HỌA PHỤ KIỆN CARD ĐỒ HỌA XEM TẤT CẢ CARD ĐỒ HỌA › ROG MATRIX Tản Nhiệt Vô Cực XEM THÊM › ROG ASTRAL Tiên Phong Công Nghệ XEM THÊM › ROG STRIX Thống Lĩnh Cuộc Chơi XEM THÊM › GIÚP TÔI LỰA CHỌN Hãy cho chúng tôi biết bạn đang cần gì. Chúng tôi sẽ giúp bạn chọn sản phẩm phù hợp. THƯƠNG HIỆU ASUS GIGABYTE MSI HÃNG CHIPSET NVIDIA AMD Intel CẤU HÌNH CHIPSET RTX 4090 RTX 4080 RTX 4070 RTX 3060 RX 7900 DUNG LƯỢNG VRAM 24GB 16GB 12GB 8GB LOẠI BỘ NHỚ GDDR6X GDDR6 GDDR5 DÒNG SẢN PHẨM ROG TUF Dual Gaming X PSU ĐỀ XUẤT 1000W 850W 750W 650W MỨC GIÁ Dưới 10 triệu Từ 10 - 20 triệu Từ 20 - 40 triệu Trên 40 triệu XEM SẢN PHẨM PHÙ HỢP PHỤ KIỆN XEM TẤT CẢ PHỤ KIỆN › ROG Herculx EVA-02 Edition Phiên bản ROG Herculx EVA-02 mạnh mẽ sẽ củng cố một cách an toàn ngay cả những card mạnh nhất, đồng thời mang đến thiết ... ROG Herculx Graphics Card Holder Giá đỡ card đồ họa ROG Herculx có thể đỡ chắc chắn và an toàn cả những card mạnh và to nạc nhất, đồng thời có thiết kế d... Chuyên cung cấp Card đồ họa chính hãng. Bảo hành uy tín — Giao hàng toàn quốc. Cập nhật sau Cập nhật sau 8:00 – 21:00 mỗi ngày VỀ CHÚNG TÔI Giới thiệu VGA Store Hệ thống Showroom Dịch vụ kỹ thuật tại nhà Thu cũ đổi mới CHÍNH SÁCH Chính sách Bảo hành Chính sách Giao hàng Mua trả góp 0% Hướng dẫn Thanh toán Hướng dẫn Đặt hàng NHẬN ƯU ĐÃI Đăng ký nhận khuyến mãi & sản phẩm mới nhất. ĐĂNG KÝ © 2025 VGA Store. Tất cả quyền được bảo lưu. Chính sách Bảo mật Tra cứu Đơn hàng 👋 Chào bạn, bạn cần tư vấn mua linh kiện gì không? ✕
      +Email không được trống




  ( ) File: file://E:\CODECNTT\DU_AN\TestingVGA\vga-store-testing\automation\E2E\modules\1_Auth\register_test.js

  ( ) Scenario Steps:
  × I.see("Email không được trống") at Test.<anonymous> (.\E2E\modules\1_Auth\register_test.js:34:5)
  √ I.forceClick(".auth-submit-btn") at Test.<anonymous> (.\E2E\modules\1_Auth\register_test.js:33:5)
  √ I.fillField("input[placeholder="Nhập họ và tên của bạn"]", "User Name") at Test.<anonymous> (.\E2E\modules\1_Auth\register_test.js:31:27)
  √ I.fillField("input[placeholder="Nhập mật khẩu"]", "pass123456") at Test.<anonymous> (.\E2E\modules\1_Auth\register_test.js:30:27)
  √ I.fillField("input[placeholder="Nhập tên đăng nhập"]", "r003_user") at Test.<anonymous> (.\E2E\modules\1_Auth\register_test.js:28:27)

  ( ) Artifacts:
  - screenshot: E:\CODECNTT\DU_AN\TestingVGA\vga-store-testing\automation\E2E\output\Kiểm_thử_Đăng_ký_các_trường_hợp_lỗi.failed.png

  ( ) Metadata:
  - browser: chromium
  - browserVersion: 149.0.7827.55
  - windowSize: 1280x720

  8) Register - Authentication
       Kiểm thử Đăng ký các trường hợp lỗi | {"testId":"R-004","username":"r004_user","email":"r004_empty_pass@gmail.com","password":"","fullName":"User Name","expectedMessage":"Mật khẩu không được trống"}:

      expected web application to include "Mật khẩu không được trống"
      + expected - actual

      -TRANG CHỦ SẢN PHẨM TIN TỨC DỊCH VỤ ĐĂNG NHẬP ĐĂNG KÝ Tên đăng nhập Họ và Tên Email Mật khẩu TẠO TÀI KHOẢN Hoặc đăng nhập bằng Google Facebook CARD ĐỒ HỌA PHỤ KIỆN CARD ĐỒ HỌA XEM TẤT CẢ CARD ĐỒ HỌA › ROG MATRIX Tản Nhiệt Vô Cực XEM THÊM › ROG ASTRAL Tiên Phong Công Nghệ XEM THÊM › ROG STRIX Thống Lĩnh Cuộc Chơi XEM THÊM › GIÚP TÔI LỰA CHỌN Hãy cho chúng tôi biết bạn đang cần gì. Chúng tôi sẽ giúp bạn chọn sản phẩm phù hợp. THƯƠNG HIỆU ASUS GIGABYTE MSI HÃNG CHIPSET NVIDIA AMD Intel CẤU HÌNH CHIPSET RTX 4090 RTX 4080 RTX 4070 RTX 3060 RX 7900 DUNG LƯỢNG VRAM 24GB 16GB 12GB 8GB LOẠI BỘ NHỚ GDDR6X GDDR6 GDDR5 DÒNG SẢN PHẨM ROG TUF Dual Gaming X PSU ĐỀ XUẤT 1000W 850W 750W 650W MỨC GIÁ Dưới 10 triệu Từ 10 - 20 triệu Từ 20 - 40 triệu Trên 40 triệu XEM SẢN PHẨM PHÙ HỢP PHỤ KIỆN XEM TẤT CẢ PHỤ KIỆN › ROG Herculx EVA-02 Edition Phiên bản ROG Herculx EVA-02 mạnh mẽ sẽ củng cố một cách an toàn ngay cả những card mạnh nhất, đồng thời mang đến thiết ... ROG Herculx Graphics Card Holder Giá đỡ card đồ họa ROG Herculx có thể đỡ chắc chắn và an toàn cả những card mạnh và to nạc nhất, đồng thời có thiết kế d... Chuyên cung cấp Card đồ họa chính hãng. Bảo hành uy tín — Giao hàng toàn quốc. Cập nhật sau Cập nhật sau 8:00 – 21:00 mỗi ngày VỀ CHÚNG TÔI Giới thiệu VGA Store Hệ thống Showroom Dịch vụ kỹ thuật tại nhà Thu cũ đổi mới CHÍNH SÁCH Chính sách Bảo hành Chính sách Giao hàng Mua trả góp 0% Hướng dẫn Thanh toán Hướng dẫn Đặt hàng NHẬN ƯU ĐÃI Đăng ký nhận khuyến mãi & sản phẩm mới nhất. ĐĂNG KÝ © 2025 VGA Store. Tất cả quyền được bảo lưu. Chính sách Bảo mật Tra cứu Đơn hàng 👋 Chào bạn, bạn cần tư vấn mua linh kiện gì không? ✕
      +Mật khẩu không được trống




  ( ) File: file://E:\CODECNTT\DU_AN\TestingVGA\vga-store-testing\automation\E2E\modules\1_Auth\register_test.js

  ( ) Scenario Steps:
  × I.see("Mật khẩu không được trống") at Test.<anonymous> (.\E2E\modules\1_Auth\register_test.js:34:5)
  √ I.forceClick(".auth-submit-btn") at Test.<anonymous> (.\E2E\modules\1_Auth\register_test.js:33:5)
  √ I.fillField("input[placeholder="Nhập họ và tên của bạn"]", "User Name") at Test.<anonymous> (.\E2E\modules\1_Auth\register_test.js:31:27)
  √ I.fillField("input[placeholder="Nhập email của bạn"]", "r004_empty_pass@gmail.com") at Test.<anonymous> (.\E2E\modules\1_Auth\register_test.js:29:24)
  √ I.fillField("input[placeholder="Nhập tên đăng nhập"]", "r004_user") at Test.<anonymous> (.\E2E\modules\1_Auth\register_test.js:28:27)

  ( ) Artifacts:
  - screenshot: E:\CODECNTT\DU_AN\TestingVGA\vga-store-testing\automation\E2E\output\Kiểm_thử_Đăng_ký_các_trường_hợp_lỗi.failed.png

  ( ) Metadata:
  - browser: chromium
  - browserVersion: 149.0.7827.55
  - windowSize: 1280x720

  9) Register - Authentication
       Kiểm thử Đăng ký các trường hợp lỗi | {"testId":"R-006","username":"ab","email":"r006_short_user@gmail.com","password":"pass123456","fullName":"User Name","expectedMessage":"Tên đăng nhập từ 3-50 ký tự"}:

      expected web application to include "Tên đăng nhập từ 3-50 ký tự"
      + expected - actual

      -TRANG CHỦ SẢN PHẨM TIN TỨC DỊCH VỤ ĐĂNG NHẬP ĐĂNG KÝ Tên đăng nhập Họ và Tên Email Mật khẩu TẠO TÀI KHOẢN Hoặc đăng nhập bằng Google Facebook CARD ĐỒ HỌA PHỤ KIỆN CARD ĐỒ HỌA XEM TẤT CẢ CARD ĐỒ HỌA › ROG MATRIX Tản Nhiệt Vô Cực XEM THÊM › ROG ASTRAL Tiên Phong Công Nghệ XEM THÊM › ROG STRIX Thống Lĩnh Cuộc Chơi XEM THÊM › GIÚP TÔI LỰA CHỌN Hãy cho chúng tôi biết bạn đang cần gì. Chúng tôi sẽ giúp bạn chọn sản phẩm phù hợp. THƯƠNG HIỆU ASUS GIGABYTE MSI HÃNG CHIPSET NVIDIA AMD Intel CẤU HÌNH CHIPSET RTX 4090 RTX 4080 RTX 4070 RTX 3060 RX 7900 DUNG LƯỢNG VRAM 24GB 16GB 12GB 8GB LOẠI BỘ NHỚ GDDR6X GDDR6 GDDR5 DÒNG SẢN PHẨM ROG TUF Dual Gaming X PSU ĐỀ XUẤT 1000W 850W 750W 650W MỨC GIÁ Dưới 10 triệu Từ 10 - 20 triệu Từ 20 - 40 triệu Trên 40 triệu XEM SẢN PHẨM PHÙ HỢP PHỤ KIỆN XEM TẤT CẢ PHỤ KIỆN › ROG Herculx EVA-02 Edition Phiên bản ROG Herculx EVA-02 mạnh mẽ sẽ củng cố một cách an toàn ngay cả những card mạnh nhất, đồng thời mang đến thiết ... ROG Herculx Graphics Card Holder Giá đỡ card đồ họa ROG Herculx có thể đỡ chắc chắn và an toàn cả những card mạnh và to nạc nhất, đồng thời có thiết kế d... Chuyên cung cấp Card đồ họa chính hãng. Bảo hành uy tín — Giao hàng toàn quốc. Cập nhật sau Cập nhật sau 8:00 – 21:00 mỗi ngày VỀ CHÚNG TÔI Giới thiệu VGA Store Hệ thống Showroom Dịch vụ kỹ thuật tại nhà Thu cũ đổi mới CHÍNH SÁCH Chính sách Bảo hành Chính sách Giao hàng Mua trả góp 0% Hướng dẫn Thanh toán Hướng dẫn Đặt hàng NHẬN ƯU ĐÃI Đăng ký nhận khuyến mãi & sản phẩm mới nhất. ĐĂNG KÝ © 2025 VGA Store. Tất cả quyền được bảo lưu. Chính sách Bảo mật Tra cứu Đơn hàng Network Error
      +Tên đăng nhập từ 3-50 ký tự




  ( ) File: file://E:\CODECNTT\DU_AN\TestingVGA\vga-store-testing\automation\E2E\modules\1_Auth\register_test.js

  ( ) Scenario Steps:
  × I.see("Tên đăng nhập từ 3-50 ký tự") at Test.<anonymous> (.\E2E\modules\1_Auth\register_test.js:34:5)
  √ I.forceClick(".auth-submit-btn") at Test.<anonymous> (.\E2E\modules\1_Auth\register_test.js:33:5)
  √ I.fillField("input[placeholder="Nhập họ và tên của bạn"]", "User Name") at Test.<anonymous> (.\E2E\modules\1_Auth\register_test.js:31:27)
  √ I.fillField("input[placeholder="Nhập mật khẩu"]", "pass123456") at Test.<anonymous> (.\E2E\modules\1_Auth\register_test.js:30:27)
  √ I.fillField("input[placeholder="Nhập email của bạn"]", "r006_short_user@gmail.com") at Test.<anonymous> (.\E2E\modules\1_Auth\register_test.js:29:24)
  √ I.fillField("input[placeholder="Nhập tên đăng nhập"]", "ab") at Test.<anonymous> (.\E2E\modules\1_Auth\register_test.js:28:27)

  ( ) Artifacts:
  - screenshot: E:\CODECNTT\DU_AN\TestingVGA\vga-store-testing\automation\E2E\output\Kiểm_thử_Đăng_ký_các_trường_hợp_lỗi.failed.png

  ( ) Metadata:
  - browser: chromium
  - browserVersion: 149.0.7827.55
  - windowSize: 1280x720

  10) Register - Authentication
       Kiểm thử Đăng ký các trường hợp lỗi | {"testId":"R-010","username":"r010_user","email":"invalidgmail","password":"pass123456","fullName":"User Name","expectedMessage":"Email không hợp lệ"}:

      expected web application to include "Email không hợp lệ"
      + expected - actual

      -TRANG CHỦ SẢN PHẨM TIN TỨC DỊCH VỤ ĐĂNG NHẬP ĐĂNG KÝ Tên đăng nhập Họ và Tên Email Mật khẩu TẠO TÀI KHOẢN Hoặc đăng nhập bằng Google Facebook CARD ĐỒ HỌA PHỤ KIỆN CARD ĐỒ HỌA XEM TẤT CẢ CARD ĐỒ HỌA › ROG MATRIX Tản Nhiệt Vô Cực XEM THÊM › ROG ASTRAL Tiên Phong Công Nghệ XEM THÊM › ROG STRIX Thống Lĩnh Cuộc Chơi XEM THÊM › GIÚP TÔI LỰA CHỌN Hãy cho chúng tôi biết bạn đang cần gì. Chúng tôi sẽ giúp bạn chọn sản phẩm phù hợp. THƯƠNG HIỆU ASUS GIGABYTE MSI HÃNG CHIPSET NVIDIA AMD Intel CẤU HÌNH CHIPSET RTX 4090 RTX 4080 RTX 4070 RTX 3060 RX 7900 DUNG LƯỢNG VRAM 24GB 16GB 12GB 8GB LOẠI BỘ NHỚ GDDR6X GDDR6 GDDR5 DÒNG SẢN PHẨM ROG TUF Dual Gaming X PSU ĐỀ XUẤT 1000W 850W 750W 650W MỨC GIÁ Dưới 10 triệu Từ 10 - 20 triệu Từ 20 - 40 triệu Trên 40 triệu XEM SẢN PHẨM PHÙ HỢP PHỤ KIỆN XEM TẤT CẢ PHỤ KIỆN › ROG Herculx EVA-02 Edition Phiên bản ROG Herculx EVA-02 mạnh mẽ sẽ củng cố một cách an toàn ngay cả những card mạnh nhất, đồng thời mang đến thiết ... ROG Herculx Graphics Card Holder Giá đỡ card đồ họa ROG Herculx có thể đỡ chắc chắn và an toàn cả những card mạnh và to nạc nhất, đồng thời có thiết kế d... Chuyên cung cấp Card đồ họa chính hãng. Bảo hành uy tín — Giao hàng toàn quốc. Cập nhật sau Cập nhật sau 8:00 – 21:00 mỗi ngày VỀ CHÚNG TÔI Giới thiệu VGA Store Hệ thống Showroom Dịch vụ kỹ thuật tại nhà Thu cũ đổi mới CHÍNH SÁCH Chính sách Bảo hành Chính sách Giao hàng Mua trả góp 0% Hướng dẫn Thanh toán Hướng dẫn Đặt hàng NHẬN ƯU ĐÃI Đăng ký nhận khuyến mãi & sản phẩm mới nhất. ĐĂNG KÝ © 2025 VGA Store. Tất cả quyền được bảo lưu. Chính sách Bảo mật Tra cứu Đơn hàng Network Error
      +Email không hợp lệ




  ( ) File: file://E:\CODECNTT\DU_AN\TestingVGA\vga-store-testing\automation\E2E\modules\1_Auth\register_test.js

  ( ) Scenario Steps:
  × I.see("Email không hợp lệ") at Test.<anonymous> (.\E2E\modules\1_Auth\register_test.js:34:5)
  √ I.forceClick(".auth-submit-btn") at Test.<anonymous> (.\E2E\modules\1_Auth\register_test.js:33:5)
  √ I.fillField("input[placeholder="Nhập họ và tên của bạn"]", "User Name") at Test.<anonymous> (.\E2E\modules\1_Auth\register_test.js:31:27)
  √ I.fillField("input[placeholder="Nhập mật khẩu"]", "pass123456") at Test.<anonymous> (.\E2E\modules\1_Auth\register_test.js:30:27)
  √ I.fillField("input[placeholder="Nhập email của bạn"]", "invalidgmail") at Test.<anonymous> (.\E2E\modules\1_Auth\register_test.js:29:24)
  √ I.fillField("input[placeholder="Nhập tên đăng nhập"]", "r010_user") at Test.<anonymous> (.\E2E\modules\1_Auth\register_test.js:28:27)

  ( ) Artifacts:
  - screenshot: E:\CODECNTT\DU_AN\TestingVGA\vga-store-testing\automation\E2E\output\Kiểm_thử_Đăng_ký_các_trường_hợp_lỗi.failed.png

  ( ) Metadata:
  - browser: chromium
  - browserVersion: 149.0.7827.55
  - windowSize: 1280x720

  11) Register - Authentication
       Kiểm thử Đăng ký các trường hợp lỗi | {"testId":"R-012","username":"hai123","email":"r012_taken@gmail.com","password":"pass123456","fullName":"Another User","expectedMessage":"Username is already taken"}:

      expected web application to include "Username is already taken"
      + expected - actual

      -TRANG CHỦ SẢN PHẨM TIN TỨC DỊCH VỤ ĐĂNG NHẬP ĐĂNG KÝ Tên đăng nhập Họ và Tên Email Mật khẩu TẠO TÀI KHOẢN Hoặc đăng nhập bằng Google Facebook CARD ĐỒ HỌA PHỤ KIỆN CARD ĐỒ HỌA XEM TẤT CẢ CARD ĐỒ HỌA › ROG MATRIX Tản Nhiệt Vô Cực XEM THÊM › ROG ASTRAL Tiên Phong Công Nghệ XEM THÊM › ROG STRIX Thống Lĩnh Cuộc Chơi XEM THÊM › GIÚP TÔI LỰA CHỌN Hãy cho chúng tôi biết bạn đang cần gì. Chúng tôi sẽ giúp bạn chọn sản phẩm phù hợp. THƯƠNG HIỆU ASUS GIGABYTE MSI HÃNG CHIPSET NVIDIA AMD Intel CẤU HÌNH CHIPSET RTX 4090 RTX 4080 RTX 4070 RTX 3060 RX 7900 DUNG LƯỢNG VRAM 24GB 16GB 12GB 8GB LOẠI BỘ NHỚ GDDR6X GDDR6 GDDR5 DÒNG SẢN PHẨM ROG TUF Dual Gaming X PSU ĐỀ XUẤT 1000W 850W 750W 650W MỨC GIÁ Dưới 10 triệu Từ 10 - 20 triệu Từ 20 - 40 triệu Trên 40 triệu XEM SẢN PHẨM PHÙ HỢP PHỤ KIỆN XEM TẤT CẢ PHỤ KIỆN › ROG Herculx EVA-02 Edition Phiên bản ROG Herculx EVA-02 mạnh mẽ sẽ củng cố một cách an toàn ngay cả những card mạnh nhất, đồng thời mang đến thiết ... ROG Herculx Graphics Card Holder Giá đỡ card đồ họa ROG Herculx có thể đỡ chắc chắn và an toàn cả những card mạnh và to nạc nhất, đồng thời có thiết kế d... Chuyên cung cấp Card đồ họa chính hãng. Bảo hành uy tín — Giao hàng toàn quốc. Cập nhật sau Cập nhật sau 8:00 – 21:00 mỗi ngày VỀ CHÚNG TÔI Giới thiệu VGA Store Hệ thống Showroom Dịch vụ kỹ thuật tại nhà Thu cũ đổi mới CHÍNH SÁCH Chính sách Bảo hành Chính sách Giao hàng Mua trả góp 0% Hướng dẫn Thanh toán Hướng dẫn Đặt hàng NHẬN ƯU ĐÃI Đăng ký nhận khuyến mãi & sản phẩm mới nhất. ĐĂNG KÝ © 2025 VGA Store. Tất cả quyền được bảo lưu. Chính sách Bảo mật Tra cứu Đơn hàng Network Error
      +Username is already taken




  ( ) File: file://E:\CODECNTT\DU_AN\TestingVGA\vga-store-testing\automation\E2E\modules\1_Auth\register_test.js

  ( ) Scenario Steps:
  × I.see("Username is already taken") at Test.<anonymous> (.\E2E\modules\1_Auth\register_test.js:34:5)
  √ I.forceClick(".auth-submit-btn") at Test.<anonymous> (.\E2E\modules\1_Auth\register_test.js:33:5)
  √ I.fillField("input[placeholder="Nhập họ và tên của bạn"]", "Another User") at Test.<anonymous> (.\E2E\modules\1_Auth\register_test.js:31:27)
  √ I.fillField("input[placeholder="Nhập mật khẩu"]", "pass123456") at Test.<anonymous> (.\E2E\modules\1_Auth\register_test.js:30:27)
  √ I.fillField("input[placeholder="Nhập email của bạn"]", "r012_taken@gmail.com") at Test.<anonymous> (.\E2E\modules\1_Auth\register_test.js:29:24)
  √ I.fillField("input[placeholder="Nhập tên đăng nhập"]", "hai123") at Test.<anonymous> (.\E2E\modules\1_Auth\register_test.js:28:27)

  ( ) Artifacts:
  - screenshot: E:\CODECNTT\DU_AN\TestingVGA\vga-store-testing\automation\E2E\output\Kiểm_thử_Đăng_ký_các_trường_hợp_lỗi.failed.png

  ( ) Metadata:
  - browser: chromium
  - browserVersion: 149.0.7827.55
  - windowSize: 1280x720


  FAIL  | 2 passed, 11 failed   // 2m
Run with --verbose flag to see complete NodeJS stacktrace