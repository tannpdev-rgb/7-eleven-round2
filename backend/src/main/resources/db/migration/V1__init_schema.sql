CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =========================================================================
-- 1. BẢNG CATEGORIES
-- =========================================================================
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    parent_id BIGINT,
    
    -- Audit Fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT  DEFAULT null,
    updated_by BIGINT  DEFAULT null,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_categories_slug ON categories(slug);

CREATE TRIGGER update_categories_modtime
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp_column();

-- =========================================================================
-- 2. BẢNG BRANDS
-- =========================================================================
CREATE TABLE brands (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    logo_url VARCHAR(500),
    
    -- Audit Fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT  DEFAULT null,
    updated_by BIGINT  DEFAULT null,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_brands_slug ON brands(slug);

CREATE TRIGGER update_brands_modtime
    BEFORE UPDATE ON brands
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp_column();

-- =========================================================================
-- 3. BẢNG PRODUCTS
-- =========================================================================
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    product_code VARCHAR(100),
    short_description TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    category_id BIGINT,
    brand_id BIGINT,
    category_name VARCHAR(255),
    brand_name VARCHAR(255),
    thumbnail_url VARCHAR(500),
    price DECIMAL(15, 2) DEFAULT 0.00,
    sale_price DECIMAL(15, 2),
    stock_quantity INTEGER DEFAULT 0,
    
    -- Audit Fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT  DEFAULT null,
    updated_by BIGINT  DEFAULT null,
    is_deleted BOOLEAN DEFAULT FALSE
    
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand_id);

CREATE TRIGGER update_products_modtime
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp_column();

-- =========================================================================
-- 4. BẢNG PRODUCT_IMAGES
-- =========================================================================
CREATE TABLE product_images (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    is_thumbnail BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    
    -- Audit Fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT  DEFAULT null,
    updated_by BIGINT  DEFAULT null,
    is_deleted BOOLEAN DEFAULT FALSE
    
);

CREATE INDEX idx_product_images_product ON product_images(product_id);

CREATE TRIGGER update_product_images_modtime
    BEFORE UPDATE ON product_images
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp_column();

-- =========================================================================
-- 5. BẢNG PRODUCT_VARIANTS
-- =========================================================================
CREATE TABLE product_variants (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    sku VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL, -- Ví dụ: "Xanh / 128GB"
    price DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    sale_price DECIMAL(15, 2),
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    image_url VARCHAR(500),
    
    -- Audit Fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT  DEFAULT null,
    updated_by BIGINT  DEFAULT null,
    is_deleted BOOLEAN DEFAULT FALSE
    
--     CONSTRAINT fk_product_variants_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX idx_product_variants_product ON product_variants(product_id);
CREATE INDEX idx_product_variants_sku ON product_variants(sku);

CREATE TRIGGER update_product_variants_modtime
    BEFORE UPDATE ON product_variants
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp_column();

-- =========================================================================
-- 6. BẢNG ORDERS
-- =========================================================================
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    order_code VARCHAR(100) NOT NULL UNIQUE,
    user_id BIGINT,
    
    -- Thông tin giao hàng
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    shipping_address TEXT NOT NULL,
    billing_address TEXT,
    
    -- Chi phí và giá trị đơn hàng
    total_amount DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    discount_amount DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    shipping_fee DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    final_amount DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    
    -- Trạng thái
    payment_method VARCHAR(50) NOT NULL DEFAULT 'COD', -- COD, BANKING, VNPAY, STRIPE
    payment_status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, PAID, FAILED, REFUNDED
    order_status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, CONFIRMED, SHIPPING, COMPLETED, CANCELLED
    note TEXT,
    
    -- Audit Fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT  DEFAULT null,
    updated_by BIGINT  DEFAULT null,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_orders_code ON orders(order_code);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(order_status);

CREATE TRIGGER update_orders_modtime
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp_column();

-- =========================================================================
-- 7. BẢNG ORDER_ITEMS
-- =========================================================================
CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_variant_id BIGINT, -- Cho phép NULL nếu variant bị xóa hoàn toàn khỏi DB nhưng thông tin đơn hàng vẫn lưu vết
    product_name VARCHAR(255) NOT NULL, -- Lưu trữ Snapshot tên sản phẩm tại thời điểm mua
    sku VARCHAR(100) NOT NULL,          -- Lưu trữ Snapshot SKU
    price DECIMAL(15, 2) NOT NULL,      -- Giá tại thời điểm mua
    quantity INTEGER NOT NULL DEFAULT 1,
    total_price DECIMAL(15, 2) NOT NULL,
    
    -- Audit Fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT  DEFAULT null,
    updated_by BIGINT  DEFAULT null,
    is_deleted BOOLEAN DEFAULT FALSE
    
--     CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
--     CONSTRAINT fk_order_items_variant FOREIGN KEY (product_variant_id) REFERENCES product_variants(id) ON DELETE SET NULL
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

CREATE TRIGGER update_order_items_modtime
    BEFORE UPDATE ON order_items
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp_column();
