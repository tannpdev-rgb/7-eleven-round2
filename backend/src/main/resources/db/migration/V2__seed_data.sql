-- 1. CATEGORIES
INSERT INTO categories (id, name, slug) VALUES
(1, 'Nước giải khát', 'nuoc-giai-khat'),
(2, 'Snack - Bánh kẹo', 'snack-banh-keo'),
(3, 'Thức ăn nhanh', 'thuc-an-nhanh'),
(4, 'Sữa - Chế phẩm sữa', 'sua-che-pham-sua'),
(5, 'Kem - Tráng miệng', 'kem-trang-mieng'),
(6, 'Chăm sóc cá nhân', 'cham-soc-ca-nhan');

-- Cập nhật chuỗi cho categories
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));

-- 2. BRANDS
INSERT INTO brands (id, name, slug) VALUES
(1, 'Suntory PepsiCo', 'suntory-pepsico'),
(2, 'Coca-Cola', 'coca-cola'),
(3, 'Orion', 'orion'),
(4, 'Oishi', 'oishi'),
(5, 'Acecook', 'acecook'),
(6, 'Vinamilk', 'vinamilk'),
(7, 'TH True Milk', 'th-true-milk'),
(8, 'Kinh Đô', 'kinh-do'),
(9, 'Unilever', 'unilever'),
(10, 'Wall''s', 'walls');

-- Cập nhật chuỗi cho brands
SELECT setval('brands_id_seq', (SELECT MAX(id) FROM brands));

-- 3. PRODUCTS
INSERT INTO products (
    id, name, slug, product_code, short_description, description,
    is_active, category_id, brand_id, category_name, brand_name,
    thumbnail_url, price, sale_price, stock_quantity
) VALUES

-- Nước giải khát
(1, 'Nước Ngọt Pepsi Cola Lon 320ml', 'pepsi-cola-lon-320ml', 'DRK-PEP-01', 'Nước ngọt có gas giải khát sảng khoái', 'Nước ngọt Pepsi Cola với hương vị cola đặc trưng, mang lại cảm giác sảng khoái tức thì.', true, 1, 1, 'Nước giải khát', 'Suntory PepsiCo', 'https://cdn.tgdd.vn/Products/Images/2565/76467/bhx/nuoc-ngot-pepsi-cola-320ml-202302271343033503.jpg', 10500, 10000, 500),
(2, 'Nước Ngọt Coca-Cola Lon 320ml', 'coca-cola-lon-320ml', 'DRK-COC-01', 'Nước ngọt có gas vị nguyên bản', 'Coca-Cola vị nguyên bản được đóng lon tiện dụng.', true, 1, 2, 'Nước giải khát', 'Coca-Cola', 'https://cdn.tgdd.vn/Products/Images/2565/76465/bhx/nuoc-ngot-coca-cola-vi-nguyen-ban-lon-320ml-202303101511520144.jpg', 11000, null, 600),
(3, 'Trà Ô Long TEA+ Plus 450ml', 'tra-o-long-tea-plus-450ml', 'DRK-TEA-01', 'Trà Ô long giải nhiệt', 'Trà Ô Long TEA+ Plus được chiết xuất từ lá trà ô long tự nhiên.', true, 1, 1, 'Nước giải khát', 'Suntory PepsiCo', 'https://cdn.tgdd.vn/Products/Images/2564/76451/bhx/6-chai-tra-o-long-tea-plus-450ml-202303021430048633.jpg', 11500, 11000, 300),

-- Snack & Bánh kẹo
(4, 'Bánh Chocopie Hộp 12 Cái', 'banh-chocopie-hop-12', 'SNK-ORI-01', 'Bánh phủ chocolate nhân marshmallow', 'Bánh Chocopie từ Orion là món ăn vặt được yêu thích với lớp vỏ chocolate mềm mịn và nhân dẻo dai.', true, 2, 3, 'Snack - Bánh kẹo', 'Orion', 'https://cdn.tgdd.vn/Products/Images/3364/79664/bhx/banh-chocopie-hop-396g-202302221319084803.jpg', 60000, 56000, 150),
(5, 'Snack Khoai Tây O''Star Vị Kim Chi', 'ostar-kim-chi', 'SNK-ORI-02', 'Snack khoai tây cắt lát', 'Snack khoai tây O''Star vị kim chi chua cay giòn rụm.', true, 2, 3, 'Snack - Bánh kẹo', 'Orion', 'https://cdn.tgdd.vn/Products/Images/3365/79468/bhx/snack-khoai-tay-vi-kim-chi-han-quoc-ostar-goi-152g-202302221345377502.jpg', 22000, null, 250),
(6, 'Snack Tôm Cay Oishi', 'snack-tom-cay-oishi', 'SNK-OIS-01', 'Snack tôm cay vị đậm đà', 'Snack tôm cay đặc trưng của Oishi, thơm ngon giòn rụm.', true, 2, 4, 'Snack - Bánh kẹo', 'Oishi', 'https://cdn.tgdd.vn/Products/Images/3365/79455/bhx/snack-tom-cay-oishi-goi-39g-202302221356499824.jpg', 6000, null, 400),

-- Thức ăn nhanh (Mì)
(7, 'Mì Hảo Hảo Tôm Chua Cay', 'mi-hao-hao-tom-chua-cay', 'FOD-ACE-01', 'Mì ăn liền quốc dân', 'Mì Hảo Hảo tôm chua cay với sợi mì dai, nước súp đậm đà.', true, 3, 5, 'Thức ăn nhanh', 'Acecook', 'https://cdn.tgdd.vn/Products/Images/2567/76358/bhx/mi-hao-hao-huong-vi-tom-chua-cay-goi-75g-202303031024036577.jpg', 4500, 4200, 1000),
(8, 'Phở Bò Trộn Handy Hảo Hảo', 'pho-bo-tron-handy-haohao', 'FOD-ACE-02', 'Phở trộn ăn liền dạng ly tiện lợi', 'Phở bò trộn Handy Hảo Hảo với sốt vang đậm đà, thiết kế ly tiện dụng.', true, 3, 5, 'Thức ăn nhanh', 'Acecook', 'https://cdn.tgdd.vn/Products/Images/2984/298910/bhx/pho-tron-bo-sot-vang-handy-hao-hao-ly-77g-202303031050212726.jpg', 16000, 15000, 200),

-- Sữa
(9, 'Sữa Tươi Tiệt Trùng Vinamilk 100% Không Đường', 'sua-tuoi-vinamilk-khong-duong-1l', 'MIL-VNM-01', 'Sữa tươi 100% nguyên chất', 'Sữa tươi tiệt trùng Vinamilk không đường hộp 1 lít.', true, 4, 6, 'Sữa - Chế phẩm sữa', 'Vinamilk', 'https://cdn.tgdd.vn/Products/Images/2943/77190/bhx/sua-tuoi-tiet-trung-khong-duong-vinamilk-100-sua-tuoi-hop-1-lit-202303040941320473.jpg', 35000, 33500, 120),
(10, 'Sữa Tươi TH True Milk Có Đường 180ml', 'th-true-milk-co-duong-180ml', 'MIL-THM-01', 'Sữa tươi sạch TH True Milk', 'Lốc 4 hộp sữa tươi TH True Milk có đường 180ml.', true, 4, 7, 'Sữa - Chế phẩm sữa', 'TH True Milk', 'https://cdn.tgdd.vn/Products/Images/2943/77242/bhx/thung-48-hop-sua-tuoi-tiet-trung-co-duong-th-true-milk-180ml-202303041014291880.jpg', 34000, 32000, 250),

-- Kem
(11, 'Kem Ốc Quế Cornetto Classic', 'kem-oc-que-cornetto', 'ICR-WAL-01', 'Kem ốc quế Wall''s hương socola', 'Kem ốc quế Cornetto Classic với lớp vỏ ốc quế giòn rụm và nhân kem mát lạnh.', true, 5, 10, 'Kem - Tráng miệng', 'Wall''s', 'https://cdn.tgdd.vn/Products/Images/7359/246473/bhx/kem-oc-que-socola-cornetto-classic-walls-cay-110ml-202206271427192661.jpg', 22000, null, 100),

-- Chăm sóc cá nhân
(12, 'Kem Đánh Răng P/S Bảo Vệ 123', 'kem-danh-rang-ps-bao-ve-123', 'PER-UNI-01', 'Bảo vệ răng toàn diện', 'Kem đánh răng P/S bảo vệ 123 chăm sóc răng miệng toàn diện.', true, 6, 9, 'Chăm sóc cá nhân', 'Unilever', 'https://cdn.tgdd.vn/Products/Images/2816/79515/bhx/kem-danh-rang-ps-bao-ve-123-ngua-sau-rang-240g-202302221448201509.jpg', 42000, 39000, 80);

-- Cập nhật chuỗi cho products
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));

-- 4. PRODUCT IMAGES
INSERT INTO product_images (product_id, image_url, is_thumbnail, display_order) VALUES
(1, 'https://cdn.tgdd.vn/Products/Images/2565/76467/bhx/nuoc-ngot-pepsi-cola-320ml-202302271343033503.jpg', true, 1),
(2, 'https://cdn.tgdd.vn/Products/Images/2565/76465/bhx/nuoc-ngot-coca-cola-vi-nguyen-ban-lon-320ml-202303101511520144.jpg', true, 1),
(3, 'https://cdn.tgdd.vn/Products/Images/2564/76451/bhx/6-chai-tra-o-long-tea-plus-450ml-202303021430048633.jpg', true, 1),
(4, 'https://cdn.tgdd.vn/Products/Images/3364/79664/bhx/banh-chocopie-hop-396g-202302221319084803.jpg', true, 1),
(5, 'https://cdn.tgdd.vn/Products/Images/3365/79468/bhx/snack-khoai-tay-vi-kim-chi-han-quoc-ostar-goi-152g-202302221345377502.jpg', true, 1),
(6, 'https://cdn.tgdd.vn/Products/Images/3365/79455/bhx/snack-tom-cay-oishi-goi-39g-202302221356499824.jpg', true, 1),
(7, 'https://cdn.tgdd.vn/Products/Images/2567/76358/bhx/mi-hao-hao-huong-vi-tom-chua-cay-goi-75g-202303031024036577.jpg', true, 1),
(8, 'https://cdn.tgdd.vn/Products/Images/2984/298910/bhx/pho-tron-bo-sot-vang-handy-hao-hao-ly-77g-202303031050212726.jpg', true, 1),
(9, 'https://cdn.tgdd.vn/Products/Images/2943/77190/bhx/sua-tuoi-tiet-trung-khong-duong-vinamilk-100-sua-tuoi-hop-1-lit-202303040941320473.jpg', true, 1),
(10, 'https://cdn.tgdd.vn/Products/Images/2943/77242/bhx/thung-48-hop-sua-tuoi-tiet-trung-co-duong-th-true-milk-180ml-202303041014291880.jpg', true, 1),
(11, 'https://cdn.tgdd.vn/Products/Images/7359/246473/bhx/kem-oc-que-socola-cornetto-classic-walls-cay-110ml-202206271427192661.jpg', true, 1),
(12, 'https://cdn.tgdd.vn/Products/Images/2816/79515/bhx/kem-danh-rang-ps-bao-ve-123-ngua-sau-rang-240g-202302221448201509.jpg', true, 1);


-- 5. PRODUCT VARIANTS (Một vài sản phẩm có biến thể như kích cỡ lốc/thùng)
INSERT INTO product_variants (product_id, sku, title, price, sale_price, stock_quantity, image_url) VALUES
(1, 'DRK-PEP-01-LON', 'Lon 320ml', 10500, 10000, 500, null),
(1, 'DRK-PEP-01-LOC', 'Lốc 6 lon', 60000, 58000, 100, null),
(4, 'SNK-ORI-01-12C', 'Hộp 12 Cái', 60000, 56000, 150, null),
(4, 'SNK-ORI-01-6C', 'Hộp 6 Cái', 32000, null, 200, null),
(10, 'MIL-THM-01-LOC', 'Lốc 4 hộp', 34000, 32000, 250, null),
(10, 'MIL-THM-01-THUNG', 'Thùng 48 hộp', 400000, 385000, 50, null);

-- 6. ORDERS
INSERT INTO orders (id, order_code, customer_name, customer_email, customer_phone, shipping_address, total_amount, discount_amount, shipping_fee, final_amount, payment_method, payment_status, order_status)
VALUES
(1, 'ORD-000001', 'Nguyễn Văn A', 'nva@example.com', '0901234567', 'Quận 1, TP.HCM', 68000, 0, 15000, 83000, 'COD', 'PENDING', 'PENDING'),
(2, 'ORD-000002', 'Trần Thị B', 'ttb@example.com', '0912345678', 'Quận 3, TP.HCM', 112000, 5000, 0, 107000, 'VNPAY', 'PAID', 'DELIVERED');

-- Cập nhật chuỗi cho orders
SELECT setval('orders_id_seq', (SELECT MAX(id) FROM orders));

-- 7. ORDER_ITEMS
INSERT INTO order_items (order_id, product_variant_id, product_name, sku, price, quantity, total_price)
VALUES
(1, 1, 'Nước Ngọt Pepsi Cola Lon 320ml', 'DRK-PEP-01-LON', 10000, 2, 20000),
(1, null, 'Mì Hảo Hảo Tôm Chua Cay', 'FOD-ACE-01', 4200, 10, 42000),
(1, null, 'Snack Tôm Cay Oishi', 'SNK-OIS-01', 6000, 1, 6000),

(2, 3, 'Bánh Chocopie Hộp 12 Cái', 'SNK-ORI-01-12C', 56000, 2, 112000);
