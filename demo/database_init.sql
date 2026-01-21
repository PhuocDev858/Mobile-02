-- =====================================================
-- MyApp Database Initialization Script
-- =====================================================
-- Database: myapp
-- Created: 2026-01-13
-- Description: Full database schema for MyApp backend
-- =====================================================

-- Drop database if exists and create new one
DROP DATABASE IF EXISTS myapp;
CREATE DATABASE myapp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE myapp;

-- =====================================================
-- TABLE: users
-- Description: User accounts and authentication
-- =====================================================
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(255),
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    reset_token VARCHAR(255),
    reset_token_expiry DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_reset_token (reset_token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: categories
-- Description: Product categories
-- =====================================================
CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: products
-- Description: Product catalog
-- =====================================================
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    category_id BIGINT,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_category (category_id),
    INDEX idx_name (name),
    INDEX idx_active (is_active),
    INDEX idx_price (price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: orders
-- Description: Customer orders
-- =====================================================
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    payment_status ENUM('UNPAID', 'PAID', 'REFUNDED', 'FAILED') NOT NULL DEFAULT 'UNPAID',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_payment_status (payment_status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: order_items
-- Description: Items in each order
-- =====================================================
CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT,
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_order (order_id),
    INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- SAMPLE DATA: Categories
-- =====================================================
INSERT INTO categories (name, description, image_url, is_active) VALUES
('Electronics', 'Electronic devices and gadgets', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500', TRUE),
('Fashion', 'Clothing and accessories', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500', TRUE),
('Home & Kitchen', 'Home appliances and kitchenware', 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500', TRUE),
('Books', 'Books and educational materials', 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500', TRUE),
('Sports', 'Sports equipment and fitness', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500', TRUE),
('Beauty', 'Beauty and personal care products', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500', TRUE),
('Toys', 'Toys and games for children', 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=500', TRUE),
('Food & Beverages', 'Food items and drinks', 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500', TRUE);

-- =====================================================
-- SAMPLE DATA: Products
-- =====================================================
INSERT INTO products (name, description, price, stock_quantity, category_id, image_url, is_active) VALUES
-- Electronics
('Smartphone Pro X', 'Latest flagship smartphone with advanced features', 999.99, 50, 1, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500', TRUE),
('Laptop Ultra 15', '15-inch high-performance laptop', 1499.99, 30, 1, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500', TRUE),
('Wireless Headphones', 'Noise-cancelling wireless headphones', 299.99, 100, 1, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', TRUE),
('Smart Watch Series 5', 'Fitness tracking smartwatch', 399.99, 75, 1, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', TRUE),
('Tablet Pro 12', '12-inch tablet for work and play', 799.99, 40, 1, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500', TRUE),

-- Fashion
('Denim Jacket', 'Classic blue denim jacket', 89.99, 60, 2, 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500', TRUE),
('Running Shoes', 'Comfortable running shoes', 129.99, 80, 2, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', TRUE),
('Leather Bag', 'Genuine leather handbag', 199.99, 45, 2, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500', TRUE),
('Sunglasses', 'UV protection sunglasses', 79.99, 120, 2, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500', TRUE),
('Cotton T-Shirt', 'Premium cotton t-shirt', 29.99, 200, 2, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', TRUE),

-- Home & Kitchen
('Coffee Maker', 'Automatic drip coffee maker', 79.99, 55, 3, 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500', TRUE),
('Blender Pro', 'High-speed blender for smoothies', 149.99, 40, 3, 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500', TRUE),
('Non-stick Cookware Set', '10-piece cookware set', 199.99, 35, 3, 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=500', TRUE),
('Air Purifier', 'HEPA air purifier for clean air', 249.99, 30, 3, 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500', TRUE),
('Vacuum Cleaner', 'Cordless vacuum cleaner', 299.99, 25, 3, 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500', TRUE),

-- Books
('The Art of Programming', 'Complete guide to programming', 49.99, 100, 4, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500', TRUE),
('Cooking Masterclass', 'Learn cooking from experts', 39.99, 80, 4, 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500', TRUE),
('Mystery Novel Collection', 'Best mystery novels of the year', 29.99, 150, 4, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500', TRUE),
('Photography Basics', 'Beginner photography guide', 34.99, 70, 4, 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=500', TRUE),

-- Sports
('Yoga Mat', 'Premium non-slip yoga mat', 39.99, 90, 5, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500', TRUE),
('Dumbbells Set', 'Adjustable dumbbells 5-25kg', 149.99, 50, 5, 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500', TRUE),
('Tennis Racket', 'Professional tennis racket', 119.99, 40, 5, 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=500', TRUE),
('Basketball', 'Official size basketball', 49.99, 100, 5, 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500', TRUE),

-- Beauty
('Skincare Set', 'Complete skincare routine set', 89.99, 60, 6, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500', TRUE),
('Hair Dryer Pro', 'Professional hair dryer', 79.99, 45, 6, 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500', TRUE),
('Makeup Palette', '12-color eyeshadow palette', 49.99, 80, 6, 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500', TRUE),
('Perfume Collection', 'Luxury perfume set', 129.99, 55, 6, 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500', TRUE),

-- Toys
('Building Blocks Set', '500-piece building blocks', 59.99, 70, 7, 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500', TRUE),
('Remote Control Car', 'Fast RC racing car', 79.99, 50, 7, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', TRUE),
('Board Game Collection', 'Family board games set', 49.99, 60, 7, 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=500', TRUE),
('Plush Teddy Bear', 'Soft and cuddly teddy bear', 29.99, 100, 7, 'https://images.unsplash.com/photo-1551515020-2e4324341b12?w=500', TRUE),

-- Food & Beverages
('Organic Coffee Beans', 'Premium arabica coffee beans', 24.99, 150, 8, 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500', TRUE),
('Green Tea Collection', 'Assorted green tea flavors', 19.99, 120, 8, 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=500', TRUE),
('Dark Chocolate Bar', 'Premium dark chocolate 85%', 9.99, 200, 8, 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=500', TRUE),
('Protein Powder', 'Whey protein supplement', 49.99, 80, 8, 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=500', TRUE);

-- =====================================================
-- SAMPLE DATA: Users
-- =====================================================
INSERT INTO users (fullname, username, email, password, is_active) VALUES
('Admin User', 'admin', 'admin@myapp.com', 'admin123', TRUE),
('John Doe', 'johndoe', 'john@example.com', 'password123', TRUE),
('Jane Smith', 'janesmith', 'jane@example.com', 'password123', TRUE),
('Bob Wilson', 'bobwilson', 'bob@example.com', 'password123', TRUE),
('Alice Brown', 'alicebrown', 'alice@example.com', 'password123', TRUE);

-- =====================================================
-- SAMPLE DATA: Orders
-- =====================================================
INSERT INTO orders (user_id, total_amount, status, payment_status) VALUES
(2, 1299.98, 'DELIVERED', 'PAID'),
(2, 159.98, 'SHIPPED', 'PAID'),
(3, 399.99, 'PROCESSING', 'PAID'),
(4, 89.99, 'CONFIRMED', 'PAID'),
(5, 249.98, 'PENDING', 'UNPAID');

-- =====================================================
-- SAMPLE DATA: Order Items
-- =====================================================
INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, subtotal) VALUES
-- Order 1
(1, 1, 'Smartphone Pro X', 1, 999.99, 999.99),
(1, 3, 'Wireless Headphones', 1, 299.99, 299.99),
-- Order 2
(2, 7, 'Running Shoes', 1, 129.99, 129.99),
(2, 10, 'Cotton T-Shirt', 1, 29.99, 29.99),
-- Order 3
(3, 4, 'Smart Watch Series 5', 1, 399.99, 399.99),
-- Order 4
(4, 6, 'Denim Jacket', 1, 89.99, 89.99),
-- Order 5
(5, 11, 'Coffee Maker', 1, 79.99, 79.99),
(5, 12, 'Blender Pro', 1, 149.99, 149.99);

-- =====================================================
-- VIEWS: Useful database views
-- =====================================================

-- View: Active products with category info
CREATE VIEW v_active_products AS
SELECT 
    p.id,
    p.name,
    p.description,
    p.price,
    p.stock_quantity,
    p.image_url,
    c.id as category_id,
    c.name as category_name,
    p.created_at
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.is_active = TRUE;

-- View: Order summary
CREATE VIEW v_order_summary AS
SELECT 
    o.id as order_id,
    o.user_id,
    u.fullname as customer_name,
    u.email as customer_email,
    o.total_amount,
    o.status,
    o.payment_status,
    COUNT(oi.id) as item_count,
    o.created_at,
    o.updated_at
FROM orders o
JOIN users u ON o.user_id = u.id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id;

-- View: Product inventory status
CREATE VIEW v_product_inventory AS
SELECT 
    p.id,
    p.name,
    p.stock_quantity,
    c.name as category_name,
    CASE 
        WHEN p.stock_quantity = 0 THEN 'Out of Stock'
        WHEN p.stock_quantity < 10 THEN 'Low Stock'
        WHEN p.stock_quantity < 50 THEN 'Medium Stock'
        ELSE 'In Stock'
    END as stock_status,
    p.is_active
FROM products p
LEFT JOIN categories c ON p.category_id = c.id;

-- =====================================================
-- STORED PROCEDURES
-- =====================================================

DELIMITER //

-- Procedure: Get user order history
CREATE PROCEDURE sp_get_user_orders(IN p_user_id BIGINT)
BEGIN
    SELECT 
        o.id,
        o.total_amount,
        o.status,
        o.payment_status,
        o.created_at,
        COUNT(oi.id) as item_count
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = p_user_id
    GROUP BY o.id
    ORDER BY o.created_at DESC;
END //

-- Procedure: Get product statistics
CREATE PROCEDURE sp_product_statistics()
BEGIN
    SELECT 
        c.name as category_name,
        COUNT(p.id) as product_count,
        SUM(p.stock_quantity) as total_stock,
        AVG(p.price) as avg_price,
        MIN(p.price) as min_price,
        MAX(p.price) as max_price
    FROM categories c
    LEFT JOIN products p ON c.id = p.category_id AND p.is_active = TRUE
    GROUP BY c.id, c.name
    ORDER BY product_count DESC;
END //

DELIMITER ;

-- =====================================================
-- INDEXES for Performance
-- =====================================================
CREATE INDEX idx_products_category_active ON products(category_id, is_active);
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status, created_at);

-- =====================================================
-- Database Summary
-- =====================================================
SELECT 'Database initialized successfully!' as message;
SELECT 
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM categories) as total_categories,
    (SELECT COUNT(*) FROM products) as total_products,
    (SELECT COUNT(*) FROM orders) as total_orders,
    (SELECT COUNT(*) FROM order_items) as total_order_items;
