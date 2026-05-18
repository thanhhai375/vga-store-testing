-- CHÈN DỮ LIỆU MẪU (MOCK DATA) ĐỂ FRONTEND TEST BỘ LỌC

-- 1. Thêm Hãng (Brands)
INSERT INTO brands (id, name, slug) VALUES
(1, 'ASUS', 'asus'),
(2, 'GIGABYTE', 'gigabyte'),
(3, 'MSI', 'msi');

-- 2. Thêm Dòng VGA (Categories)
INSERT INTO categories (id, name, slug) VALUES
(1, 'NVIDIA RTX 40 Series', 'nvidia-rtx-40-series'),
(2, 'AMD Radeon RX 7000', 'amd-radeon-rx-7000');

-- 3. Thêm Sản phẩm (Products) - CÓ ĐỦ VRAM VÀ GPU ĐỂ LỌC
INSERT INTO products (brand_id, category_id, name, slug, price, old_price, stock, thumbnail, vram, gpu_model, status) VALUES
(1, 1, 'ASUS ROG Strix RTX 4090 Black Edition', 'asus-rog-strix-rtx-4090-black', 55000000, 60500000, 10, 'link_anh_1.jpg', '24GB', 'RTX 4090', 'ACTIVE'),
(1, 1, 'ASUS ROG Strix RTX 4090 White Edition', 'asus-rog-strix-rtx-4090-white', 56000000, 61000000, 5, 'link_anh_2.jpg', '24GB', 'RTX 4090', 'ACTIVE'),
(2, 1, 'GIGABYTE AORUS RTX 4070 Ti SUPER', 'gigabyte-aorus-rtx-4070-ti-super', 25990000, 28000000, 15, 'link_anh_3.jpg', '16GB', 'RTX 4070 Ti SUPER', 'ACTIVE'),
(3, 2, 'MSI Radeon RX 7900 XTX Gaming Trio', 'msi-radeon-rx-7900-xtx', 28500000, 31000000, 8, 'link_anh_4.jpg', '24GB', 'RX 7900 XTX', 'ACTIVE');

-- 4. Thêm 1 Tài khoản Admin và 1 Khách hàng để test Đăng nhập
INSERT INTO users (full_name, email, password_hash, role) VALUES
('Admin VGA', 'admin@vgastore.com', '$2a$10$VD1... (mã hash của pass 123456)', 'ADMIN'),
('Khách Hàng VIP', 'khach@gmail.com', '$2a$10$VD1... (mã hash của pass 123456)', 'USER');

-- 5. Thêm 1 Đơn hàng mẫu để hiển thị ở trang Track Order
INSERT INTO orders (order_code, user_id, customer_name, customer_phone, shipping_address, total_amount, status) VALUES
('VGA-240399', 2, 'Khách Hàng VIP', '0987654321', 'Q1, TP.HCM', 55000000, 'SHIPPING');