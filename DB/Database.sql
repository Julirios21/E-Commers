-- =============================================
-- E-COMMERCE DATABASE SCHEMA
-- PostgreSQL
-- =============================================

-- Enums
CREATE TYPE user_role AS ENUM ('admin', 'customer');
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- =============================================
-- TABLA: users
-- =============================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- TABLA: categories
-- =============================================
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- TABLA: products
-- =============================================
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(220) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    stock INT DEFAULT 0 CHECK (stock >= 0),
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    category_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_products_category
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

-- =============================================
-- TABLA: cart_items
-- =============================================
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_cart_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_cart_product
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT uq_cart_user_product
        UNIQUE (user_id, product_id)
);

-- =============================================
-- TABLA: orders
-- =============================================
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    status order_status DEFAULT 'pending',
    total DECIMAL(10,2) NOT NULL,
    shipping_address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_orders_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);

-- =============================================
-- TABLA: order_items
-- =============================================
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_order_items_order
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_items_product
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

-- =============================================
-- TABLA: payments
-- =============================================
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    method VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status payment_status DEFAULT 'pending',
    reference VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_payments_order
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE RESTRICT
);

-- =============================================
-- ÍNDICES
-- =============================================
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_cart_items_user ON cart_items(user_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_payments_order ON payments(order_id);
