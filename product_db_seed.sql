USE product_db;

-- ========================
-- 1. Categories
-- ========================
INSERT INTO category (shortname, name, description) VALUES
('ao', 'Áo', 'Các loại áo thời trang nam nữ'),
('quan', 'Quần', 'Quần jean, kaki, short các loại'),
('dam', 'Đầm & Váy', 'Đầm dự tiệc, váy công sở, áo dài'),
('giay', 'Giày & Dép', 'Giày thể thao, dép sandal'),
('tui', 'Túi & Balo', 'Túi xách, balo thời trang'),
('phu_kien', 'Phụ kiện', 'Thắt lưng, mũ nón, kính mát')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- ========================
-- 2. Products
-- ========================
INSERT INTO product (name, price_before, price_after, init_quantity, current_quantity, sold, description, status, category, store_id, rate, is_delete, created_by, created_at) VALUES
-- Áo
('Áo Thun Nam Basic Oversize Cotton', 250000, 179000, 200, 185, 15, 'Áo thun nam form rộng, chất liệu cotton 100% cao cấp, thoáng mát. Phù hợp đi chơi, đi học hàng ngày.', 'active', 'ao', 'store_001', 4.7, 0, 'admin', NOW()),
('Áo Polo Nam Cổ Bẻ Premium', 450000, 320000, 150, 138, 12, 'Áo polo nam chất liệu pique cao cấp, thêu logo tinh tế. Form chuẩn, tôn dáng.', 'active', 'ao', 'store_001', 4.8, 0, 'admin', NOW()),
('Áo Sơ Mi Nữ Linen Cổ V', 380000, 289000, 120, 108, 12, 'Áo sơ mi nữ vải linen tự nhiên, kiểu cổ V nhẹ nhàng, phù hợp công sở và đi chơi.', 'active', 'ao', 'store_001', 4.6, 0, 'admin', NOW()),
('Áo Khoác Jean Unisex Vintage', 650000, 499000, 80, 72, 8, 'Áo khoác jean form rộng unisex phong cách vintage retro. Chất liệu denim dày dặn, bền đẹp.', 'active', 'ao', 'store_001', 4.9, 0, 'admin', NOW()),
('Áo Hoodie Nỉ Bông Unisex', 420000, 329000, 100, 91, 9, 'Áo hoodie chất nỉ bông dày, ấm áp. Thiết kế tối giản, dễ phối đồ.', 'active', 'ao', 'store_002', 4.5, 0, 'admin', NOW()),
('Áo Crop Top Nữ Thun Gân', 180000, 129000, 150, 142, 8, 'Áo crop top nữ chất thun gân co giãn 4 chiều, ôm body vừa vặn.', 'active', 'ao', 'store_002', 4.4, 0, 'admin', NOW()),

-- Quần
('Quần Jean Nam Skinny Xanh Đậm', 550000, 389000, 120, 105, 15, 'Quần jean nam dáng skinny co giãn nhẹ, màu xanh đậm classic. Dễ phối với nhiều loại áo.', 'active', 'quan', 'store_001', 4.6, 0, 'admin', NOW()),
('Quần Kaki Nam Slim Fit Kem', 420000, 299000, 100, 88, 12, 'Quần kaki nam dáng slim fit gọn gàng, màu kem thanh lịch. Phù hợp công sở và đi chơi.', 'active', 'quan', 'store_001', 4.7, 0, 'admin', NOW()),
('Quần Short Nữ Lưng Cao Vintage', 280000, 199000, 130, 118, 12, 'Quần short nữ lưng cao phong cách vintage, chất liệu denim mềm mại.', 'active', 'quan', 'store_002', 4.5, 0, 'admin', NOW()),
('Quần Jogger Unisex Thun Nỉ', 350000, 249000, 150, 135, 15, 'Quần jogger unisex chất nỉ bông, co giãn thoải mái. Phù hợp thể thao và casual.', 'active', 'quan', 'store_002', 4.3, 0, 'admin', NOW()),

-- Đầm & Váy
('Đầm Maxi Hoa Nhí Mùa Hè', 680000, 490000, 80, 74, 6, 'Đầm maxi dáng dài họa tiết hoa nhí nhẹ nhàng, vải voan mỏng mát. Phù hợp đi biển và dạo phố.', 'active', 'dam', 'store_003', 4.8, 0, 'admin', NOW()),
('Váy Xòe Công Sở Houndstooth', 520000, 380000, 90, 84, 6, 'Váy xòe kẻ houndstooth thanh lịch, kiểu thiết kế công sở tinh tế. Dài qua gối.', 'active', 'dam', 'store_003', 4.7, 0, 'admin', NOW()),
('Đầm Wrap Đơn Giản Màu Trơn', 590000, 420000, 70, 65, 5, 'Đầm wrap kiểu quấn thắt eo tôn dáng, màu trơn dễ phối. Vải lụa mịn mát.', 'active', 'dam', 'store_003', 4.9, 0, 'admin', NOW()),

-- Giày
('Giày Sneaker Nam Trắng Cổ Thấp', 850000, 650000, 80, 72, 8, 'Giày sneaker nam màu trắng cổ thấp basic, đế cao su bền, đi êm. Dễ phối với mọi outfit.', 'active', 'giay', 'store_004', 4.8, 0, 'admin', NOW()),
('Sandal Nữ Quai Chéo Thời Trang', 320000, 220000, 120, 112, 8, 'Sandal nữ quai chéo mảnh thời trang, đế nền 3cm thoải mái. Phù hợp đi chơi mùa hè.', 'active', 'giay', 'store_004', 4.5, 0, 'admin', NOW()),

-- Túi & Balo
('Túi Tote Canvas In Chữ Minimalist', 280000, 199000, 150, 138, 12, 'Túi tote vải canvas dày, in họa tiết chữ minimalist. Dùng đi học, đi chợ, đi làm tiện lợi.', 'active', 'tui', 'store_005', 4.6, 0, 'admin', NOW()),
('Balo Laptop 15 inch Unisex Chống Thấm', 780000, 590000, 80, 75, 5, 'Balo đựng laptop 15 inch, chất liệu chống thấm nước, nhiều ngăn tiện dụng. Thiết kế unisex hiện đại.', 'active', 'tui', 'store_005', 4.9, 0, 'admin', NOW()),
('Túi Đeo Chéo Nữ Da PU Mini', 450000, 320000, 100, 93, 7, 'Túi đeo chéo nữ da PU mềm mini xinh xắn, khóa kéo chắc chắn. Đựng vừa điện thoại và ví.', 'active', 'tui', 'store_005', 4.7, 0, 'admin', NOW()),

-- Phụ kiện
('Mũ Bucket Hat Unisex Phong Cách', 180000, 129000, 200, 188, 12, 'Mũ bucket hat unisex nhiều màu sắc trẻ trung, chất liệu vải dù thoáng.', 'active', 'phu_kien', 'store_006', 4.5, 0, 'admin', NOW()),
('Kính Mát Phi Công Vintage UV400', 350000, 249000, 100, 93, 7, 'Kính mát phi công gọng kim loại mỏng nhẹ, tròng UV400 chống nắng hiệu quả.', 'active', 'phu_kien', 'store_006', 4.6, 0, 'admin', NOW()),
('Thắt Lưng Da Bò Thật Nam Khóa Pin', 420000, 310000, 80, 76, 4, 'Thắt lưng da bò thật 100%, khóa pin mạ vàng sang trọng. Bền bỉ, không bong tróc.', 'active', 'phu_kien', 'store_006', 4.8, 0, 'admin', NOW());

-- ========================
-- 3. Product Images (public image URLs)
-- ========================
INSERT INTO product_image (id, product_id, url, created_by, created_at) VALUES
('img-001', 1, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', 'admin', NOW()),
('img-002', 2, 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500', 'admin', NOW()),
('img-003', 3, 'https://images.unsplash.com/photo-1594938298603-c8148c4b4711?w=500', 'admin', NOW()),
('img-004', 4, 'https://images.unsplash.com/photo-1544441893-675973e31985?w=500', 'admin', NOW()),
('img-005', 5, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500', 'admin', NOW()),
('img-006', 6, 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=500', 'admin', NOW()),
('img-007', 7, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', 'admin', NOW()),
('img-008', 8, 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500', 'admin', NOW()),
('img-009', 9, 'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=500', 'admin', NOW()),
('img-010', 10, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500', 'admin', NOW()),
('img-011', 11, 'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=500', 'admin', NOW()),
('img-012', 12, 'https://images.unsplash.com/photo-1583496661160-fb5218ec5493?w=500', 'admin', NOW()),
('img-013', 13, 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500', 'admin', NOW()),
('img-014', 14, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', 'admin', NOW()),
('img-015', 15, 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500', 'admin', NOW()),
('img-016', 16, 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500', 'admin', NOW()),
('img-017', 17, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', 'admin', NOW()),
('img-018', 18, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500', 'admin', NOW()),
('img-019', 19, 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500', 'admin', NOW()),
('img-020', 20, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500', 'admin', NOW()),
('img-021', 21, 'https://images.unsplash.com/photo-1624222247344-550fb60fdbc0?w=500', 'admin', NOW());

-- ========================
-- 4. Product Variants
-- ========================
INSERT INTO product_variant (product_id, size, color, price_before, price_after, init_quantity, current_quantity, sold, sku) VALUES
-- Áo Thun Nam (id=1)
(1, 'S', 'Trắng', 250000, 179000, 30, 28, 2, 'AT-001-S-TRG'),
(1, 'M', 'Trắng', 250000, 179000, 50, 47, 3, 'AT-001-M-TRG'),
(1, 'L', 'Trắng', 250000, 179000, 50, 46, 4, 'AT-001-L-TRG'),
(1, 'M', 'Đen', 250000, 179000, 40, 37, 3, 'AT-001-M-DEN'),
(1, 'L', 'Đen', 250000, 179000, 30, 27, 3, 'AT-001-L-DEN'),

-- Áo Polo (id=2)
(2, 'M', 'Navy', 450000, 320000, 40, 37, 3, 'AP-002-M-NV'),
(2, 'L', 'Navy', 450000, 320000, 40, 36, 4, 'AP-002-L-NV'),
(2, 'M', 'Trắng', 450000, 320000, 35, 32, 3, 'AP-002-M-TRG'),
(2, 'L', 'Đỏ đô', 450000, 320000, 35, 33, 2, 'AP-002-L-DD'),

-- Quần Jean Nam (id=7)
(7, '30', 'Xanh đậm', 550000, 389000, 30, 27, 3, 'QJ-007-30-XD'),
(7, '31', 'Xanh đậm', 550000, 389000, 30, 26, 4, 'QJ-007-31-XD'),
(7, '32', 'Xanh đậm', 550000, 389000, 30, 27, 3, 'QJ-007-32-XD'),
(7, '32', 'Xanh nhạt', 550000, 389000, 30, 25, 5, 'QJ-007-32-XN'),

-- Giày Sneaker (id=14)
(14, '40', 'Trắng', 850000, 650000, 20, 18, 2, 'GS-014-40-TRG'),
(14, '41', 'Trắng', 850000, 650000, 20, 18, 2, 'GS-014-41-TRG'),
(14, '42', 'Trắng', 850000, 650000, 20, 18, 2, 'GS-014-42-TRG'),
(14, '42', 'Đen', 850000, 650000, 20, 18, 2, 'GS-014-42-DEN');

SELECT CONCAT('✅ Đã insert ', COUNT(*), ' sản phẩm') AS result FROM product;
SELECT CONCAT('✅ Đã insert ', COUNT(*), ' categories') AS result FROM category;
SELECT CONCAT('✅ Đã insert ', COUNT(*), ' images') AS result FROM product_image;
SELECT CONCAT('✅ Đã insert ', COUNT(*), ' variants') AS result FROM product_variant;
