-- =====================================================
-- Mobile Shop - Products & Categories Data (VND)
-- =====================================================
-- File: sample_data_vnd.sql
-- Description: Comprehensive product catalog for mobile shop
-- Prices in Vietnamese Dong (VND)
-- =====================================================

USE myapp;

-- Clear existing data
SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM products;
DELETE FROM categories;
ALTER TABLE categories AUTO_INCREMENT = 1;
ALTER TABLE products AUTO_INCREMENT = 1;
ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE orders AUTO_INCREMENT = 1;
ALTER TABLE order_items AUTO_INCREMENT = 1;
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- CATEGORIES
-- =====================================================
INSERT INTO categories (id, name, description, image_url, is_active) VALUES
(1, 'Smartphones', 'Latest smartphones from top brands', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800', TRUE),
(2, 'Tablets', 'Powerful tablets for work and entertainment', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800', TRUE),
(3, 'Laptops', 'High-performance laptops and notebooks', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800', TRUE),
(4, 'Headphones', 'Premium audio devices and headphones', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', TRUE),
(5, 'Smartwatches', 'Fitness and smart wearables', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', TRUE),
(6, 'Accessories', 'Phone cases, chargers, and more', 'https://images.unsplash.com/photo-1601524909162-ae8725290836?w=800', TRUE),
(7, 'Cameras', 'Professional cameras and lenses', 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800', TRUE),
(8, 'Gaming', 'Gaming consoles and accessories', 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800', TRUE);

-- =====================================================
-- PRODUCTS - Smartphones
-- =====================================================
INSERT INTO products (name, description, price, stock_quantity, category_id, image_url, is_active) VALUES
-- iPhone Series
('iPhone 15 Pro Max', 'Apple iPhone 15 Pro Max 256GB - Titanium finish, A17 Pro chip, ProMotion display', 32499750, 45, 1, 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800', TRUE),
('iPhone 15 Pro', 'Apple iPhone 15 Pro 128GB - Premium titanium design with advanced camera system', 24999750, 60, 1, 'https://images.unsplash.com/photo-1695048133139-1019611c2ebd?w=800', TRUE),
('iPhone 15', 'Apple iPhone 15 128GB - Dynamic Island, 48MP camera, all-day battery', 19999750, 80, 1, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800', TRUE),
('iPhone 14', 'Apple iPhone 14 128GB - A15 Bionic chip, advanced dual-camera system', 17499750, 50, 1, 'https://images.unsplash.com/photo-1678652197950-34f0e6b80579?w=800', TRUE),

-- Samsung Galaxy Series
('Samsung Galaxy S24 Ultra', 'Galaxy S24 Ultra 512GB - Snapdragon 8 Gen 3, 200MP camera, S Pen included', 34999750, 35, 1, 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800', TRUE),
('Samsung Galaxy S24+', 'Galaxy S24+ 256GB - Premium flagship with AI features and exceptional display', 27499750, 50, 1, 'https://images.unsplash.com/photo-1672653998395-e9b3eec0af5e?w=800', TRUE),
('Samsung Galaxy S24', 'Galaxy S24 128GB - Compact powerhouse with latest AI technology', 21249750, 70, 1, 'https://images.unsplash.com/photo-1674296209649-51fd8e8e9c90?w=800', TRUE),
('Samsung Galaxy A54', 'Galaxy A54 5G 128GB - Mid-range excellence with premium features', 11249750, 90, 1, 'https://images.unsplash.com/photo-1674752164019-b4e0b5b66dff?w=800', TRUE),

-- Google Pixel Series
('Google Pixel 8 Pro', 'Pixel 8 Pro 256GB - Best Android camera, Tensor G3 chip, pure Android experience', 24999750, 40, 1, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800', TRUE),
('Google Pixel 8', 'Pixel 8 128GB - Flagship features in compact size, excellent photography', 17499750, 55, 1, 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=800', TRUE),

-- OnePlus Series
('OnePlus 12', 'OnePlus 12 256GB - Snapdragon 8 Gen 3, 120Hz AMOLED, ultra-fast charging', 19999750, 45, 1, 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800', TRUE),
('OnePlus Nord 3', 'OnePlus Nord 3 5G 128GB - Premium mid-range with flagship features', 9999750, 60, 1, 'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=800', TRUE),

-- Xiaomi Series
('Xiaomi 14 Ultra', 'Xiaomi 14 Ultra 512GB - Leica cameras, Snapdragon 8 Gen 3, premium build', 28749750, 30, 1, 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800', TRUE),
('Xiaomi 14', 'Xiaomi 14 256GB - Flagship performance at competitive price', 18749750, 50, 1, 'https://images.unsplash.com/photo-1580522154071-c6ca47a859ad?w=800', TRUE),

-- =====================================================
-- PRODUCTS - Tablets
-- =====================================================
('iPad Pro 12.9" M2', 'iPad Pro 12.9-inch 512GB - M2 chip, Liquid Retina XDR display, ProMotion', 32499750, 25, 2, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800', TRUE),
('iPad Pro 11" M2', 'iPad Pro 11-inch 256GB - Powerful M2 chip, all-day battery life', 22499750, 35, 2, 'https://images.unsplash.com/photo-1585790050230-5dd28404f389?w=800', TRUE),
('iPad Air', 'iPad Air 5th Gen 256GB - M1 chip, stunning 10.9" display', 18749750, 45, 2, 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800', TRUE),
('iPad 10th Gen', 'iPad 10.9" 64GB - All-screen design, great for everyday use', 11249750, 60, 2, 'https://images.unsplash.com/photo-1527698266440-12104e498b76?w=800', TRUE),
('Samsung Galaxy Tab S9 Ultra', 'Galaxy Tab S9 Ultra 512GB - Massive 14.6" display, S Pen included', 29999750, 20, 2, 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800', TRUE),
('Samsung Galaxy Tab S9', 'Galaxy Tab S9 256GB - Premium Android tablet, 11" display', 19999750, 35, 2, 'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=800', TRUE),
('Microsoft Surface Pro 9', 'Surface Pro 9 256GB - Intel i5, laptop versatility, tablet portability', 27499750, 30, 2, 'https://images.unsplash.com/photo-1600096194534-95cf5ece04cf?w=800', TRUE),

-- =====================================================
-- PRODUCTS - Laptops
-- =====================================================
('MacBook Pro 16" M3 Max', 'MacBook Pro 16" M3 Max 1TB - Ultimate power for professionals', 87499750, 15, 3, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800', TRUE),
('MacBook Pro 14" M3 Pro', 'MacBook Pro 14" M3 Pro 512GB - Perfect balance of power and portability', 59999750, 25, 3, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800', TRUE),
('MacBook Air 15" M2', 'MacBook Air 15" M2 256GB - Thin, light, and powerful everyday laptop', 32499750, 40, 3, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800', TRUE),
('MacBook Air 13" M2', 'MacBook Air 13" M2 256GB - Ultimate portability with M2 performance', 27499750, 50, 3, 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800', TRUE),
('Dell XPS 15', 'Dell XPS 15 512GB - Intel i7, NVIDIA RTX graphics, InfinityEdge display', 47499750, 30, 3, 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800', TRUE),
('Dell XPS 13', 'Dell XPS 13 256GB - Premium ultrabook, stunning design', 32499750, 35, 3, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800', TRUE),
('HP Spectre x360', 'HP Spectre x360 512GB - 2-in-1 convertible, Intel i7, pen included', 39999750, 25, 3, 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800', TRUE),
('Lenovo ThinkPad X1 Carbon', 'ThinkPad X1 Carbon Gen 11 512GB - Business-class reliability', 44999750, 30, 3, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800', TRUE),
('ASUS ROG Zephyrus G14', 'ROG Zephyrus G14 1TB - AMD Ryzen 9, NVIDIA RTX 4060, gaming powerhouse', 42499750, 20, 3, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800', TRUE),

-- =====================================================
-- PRODUCTS - Headphones
-- =====================================================
('AirPods Pro 2', 'AirPods Pro 2nd Gen - Active noise cancellation, spatial audio', 6249750, 100, 4, 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800', TRUE),
('AirPods Max', 'AirPods Max - Premium over-ear headphones, exceptional audio quality', 13749750, 40, 4, 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800', TRUE),
('AirPods 3', 'AirPods 3rd Gen - Spatial audio, sweat resistant', 4499750, 120, 4, 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800', TRUE),
('Sony WH-1000XM5', 'Sony WH-1000XM5 - Industry-leading noise cancellation', 9999750, 60, 4, 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800', TRUE),
('Sony WF-1000XM5', 'Sony WF-1000XM5 - Premium earbuds with best-in-class ANC', 7499750, 70, 4, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800', TRUE),
('Bose QuietComfort 45', 'Bose QC45 - Legendary comfort, balanced audio', 8249750, 50, 4, 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800', TRUE),
('Samsung Galaxy Buds 2 Pro', 'Galaxy Buds 2 Pro - Premium earbuds with intelligent ANC', 5749750, 80, 4, 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800', TRUE),
('Beats Studio Pro', 'Beats Studio Pro - Premium sound, seamless Apple integration', 8749750, 55, 4, 'https://images.unsplash.com/photo-1577174881658-0f30157d80f2?w=800', TRUE),

-- =====================================================
-- PRODUCTS - Smartwatches
-- =====================================================
('Apple Watch Ultra 2', 'Apple Watch Ultra 2 - Titanium case, extreme sports features', 19999750, 35, 5, 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800', TRUE),
('Apple Watch Series 9', 'Apple Watch Series 9 45mm - Advanced health features, always-on display', 10749750, 70, 5, 'https://images.unsplash.com/photo-1510017098667-27dfc7150acb?w=800', TRUE),
('Apple Watch SE', 'Apple Watch SE 44mm - Essential features at great value', 6999750, 90, 5, 'https://images.unsplash.com/photo-1579721840641-7d0e67f1204e?w=800', TRUE),
('Samsung Galaxy Watch 6 Classic', 'Galaxy Watch 6 Classic 47mm - Rotating bezel, comprehensive health tracking', 10749750, 50, 5, 'https://images.unsplash.com/photo-1617625802912-cdf89a7c0e6f?w=800', TRUE),
('Samsung Galaxy Watch 6', 'Galaxy Watch 6 44mm - Sleek design, advanced fitness features', 8249750, 60, 5, 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=800', TRUE),
('Garmin Fenix 7', 'Garmin Fenix 7 - Premium multisport GPS watch', 17499750, 30, 5, 'https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=800', TRUE),
('Fitbit Sense 2', 'Fitbit Sense 2 - Advanced health smartwatch', 7499750, 45, 5, 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800', TRUE),

-- =====================================================
-- PRODUCTS - Accessories
-- =====================================================
('MagSafe Charger', 'Apple MagSafe Charger - Fast wireless charging for iPhone', 999750, 200, 6, 'https://images.unsplash.com/photo-1611651338412-8403fa6e3599?w=800', TRUE),
('USB-C Power Adapter 67W', 'Apple 67W USB-C Power Adapter - Fast charging for MacBook', 1499750, 150, 6, 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800', TRUE),
('Silicone Case iPhone 15', 'Apple Silicone Case for iPhone 15 - Multiple colors available', 1249750, 180, 6, 'https://images.unsplash.com/photo-1592286927505-39e59d9d6d83?w=800', TRUE),
('Clear Case iPhone 15 Pro', 'Apple Clear Case with MagSafe for iPhone 15 Pro', 1249750, 160, 6, 'https://images.unsplash.com/photo-1601524909162-ae8725290836?w=800', TRUE),
('Leather Wallet MagSafe', 'Apple Leather Wallet with MagSafe - Premium leather finish', 1499750, 100, 6, 'https://images.unsplash.com/photo-1622705766990-7bd3aaa3e4ea?w=800', TRUE),
('Anker PowerCore 20000mAh', 'Anker PowerCore 20000mAh - High-capacity power bank', 1249750, 120, 6, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800', TRUE),
('Samsung 45W Charger', 'Samsung 45W Super Fast Charging Adapter', 1124750, 140, 6, 'https://images.unsplash.com/photo-1624823183493-ed5832f48f18?w=800', TRUE),
('Spigen Tough Armor Case', 'Spigen Tough Armor Case - Military-grade protection', 874750, 200, 6, 'https://images.unsplash.com/photo-1588059916365-e6e867c375fc?w=800', TRUE),
('Belkin 3-in-1 Wireless Charger', 'Belkin Boost Charge Pro 3-in-1 - Charge iPhone, Watch, AirPods', 3749750, 70, 6, 'https://images.unsplash.com/photo-1591290619762-0f615f6c5b88?w=800', TRUE),
('Anker USB-C Cable', 'Anker PowerLine III USB-C to USB-C Cable - 6ft, fast charging', 374750, 250, 6, 'https://images.unsplash.com/photo-1603575448878-868a20723f5d?w=800', TRUE),

-- =====================================================
-- PRODUCTS - Cameras
-- =====================================================
('Sony A7 IV', 'Sony Alpha 7 IV - 33MP full-frame mirrorless camera', 62499750, 15, 7, 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800', TRUE),
('Canon EOS R6 Mark II', 'Canon EOS R6 Mark II - 24MP full-frame, exceptional autofocus', 62499750, 18, 7, 'https://images.unsplash.com/photo-1606982537835-9ef97e6d8e22?w=800', TRUE),
('Nikon Z6 III', 'Nikon Z6 III - 24MP full-frame mirrorless, 4K 60p video', 54999750, 20, 7, 'https://images.unsplash.com/photo-1613143659939-8c9e8a89a3b6?w=800', TRUE),
('Fujifilm X-T5', 'Fujifilm X-T5 - 40MP APS-C sensor, classic design', 42499750, 25, 7, 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800', TRUE),
('GoPro Hero 12 Black', 'GoPro Hero 12 Black - Ultimate action camera with 5.3K video', 11249750, 60, 7, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', TRUE),
('DJI Mavic 3 Pro', 'DJI Mavic 3 Pro - Professional drone with triple camera system', 54999750, 12, 7, 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=800', TRUE),

-- =====================================================
-- PRODUCTS - Gaming
-- =====================================================
('PlayStation 5', 'Sony PlayStation 5 - Next-gen gaming console with 1TB SSD', 12499750, 40, 8, 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800', TRUE),
('PlayStation 5 Digital', 'Sony PlayStation 5 Digital Edition - All-digital gaming', 11249750, 35, 8, 'https://images.unsplash.com/photo-1622297845775-5ff3fef71d13?w=800', TRUE),
('Xbox Series X', 'Microsoft Xbox Series X - 4K gaming powerhouse', 12499750, 45, 8, 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800', TRUE),
('Xbox Series S', 'Microsoft Xbox Series S - Compact next-gen gaming', 7499750, 60, 8, 'https://images.unsplash.com/photo-1621259182008-5d4d27c1eb0a?w=800', TRUE),
('Nintendo Switch OLED', 'Nintendo Switch OLED Model - Vibrant 7-inch OLED screen', 8749750, 70, 8, 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800', TRUE),
('Steam Deck 512GB', 'Valve Steam Deck 512GB - Portable PC gaming', 16249750, 30, 8, 'https://images.unsplash.com/photo-1625805866449-3589fe3f71a3?w=800', TRUE),
('PlayStation VR2', 'Sony PlayStation VR2 - Next-gen virtual reality headset', 13749750, 25, 8, 'https://images.unsplash.com/photo-1617802690658-1173a812650d?w=800', TRUE),
('Razer DeathAdder V3', 'Razer DeathAdder V3 Gaming Mouse - Ergonomic, precise', 1749750, 100, 8, 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800', TRUE),
('Logitech G Pro X Keyboard', 'Logitech G Pro X Mechanical Gaming Keyboard', 3749750, 80, 8, 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800', TRUE);

-- =====================================================
-- Sample Users (for testing)
-- =====================================================
INSERT INTO users (fullname, username, email, password, is_active) VALUES
('Admin', 'admin', 'admin@mobileshop.com', 'admin123', TRUE),
('John Smith', 'johnsmith', 'john.smith@email.com', 'password123', TRUE),
('Emma Wilson', 'emmawilson', 'emma.wilson@email.com', 'password123', TRUE),
('Michael Brown', 'michaelbrown', 'michael.brown@email.com', 'password123', TRUE),
('Sarah Johnson', 'sarahjohnson', 'sarah.johnson@email.com', 'password123', TRUE),
('David Lee', 'davidlee', 'david.lee@email.com', 'password123', TRUE),
('Lisa Chen', 'lisachen', 'lisa.chen@email.com', 'password123', TRUE),
('James Taylor', 'jamestaylor', 'james.taylor@email.com', 'password123', TRUE),
('Maria Garcia', 'mariagarcia', 'maria.garcia@email.com', 'password123', TRUE),
('Robert Anderson', 'robertanderson', 'robert.anderson@email.com', 'password123', TRUE);

-- =====================================================
-- Sample Orders
-- =====================================================
INSERT INTO orders (user_id, total_amount, status, payment_status, created_at) VALUES
(2, 38749250, 'DELIVERED', 'PAID', DATE_SUB(NOW(), INTERVAL 30 DAY)),
(2, 6249750, 'DELIVERED', 'PAID', DATE_SUB(NOW(), INTERVAL 25 DAY)),
(3, 69999500, 'DELIVERED', 'PAID', DATE_SUB(NOW(), INTERVAL 20 DAY)),
(4, 27499750, 'SHIPPED', 'PAID', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(5, 9999750, 'PROCESSING', 'PAID', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(6, 21249750, 'CONFIRMED', 'PAID', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(7, 44999500, 'PENDING', 'UNPAID', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(8, 13749750, 'DELIVERED', 'PAID', DATE_SUB(NOW(), INTERVAL 45 DAY)),
(9, 8249750, 'CANCELLED', 'REFUNDED', DATE_SUB(NOW(), INTERVAL 15 DAY)),
(10, 32499750, 'PROCESSING', 'PAID', NOW());

-- =====================================================
-- Sample Order Items
-- =====================================================
INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, subtotal) VALUES
-- Order 1
(1, 3, 'iPhone 15', 1, 19999750, 19999750),
(1, 30, 'AirPods Pro 2', 1, 6249750, 6249750),
(1, 38, 'Anker PowerCore 20000mAh', 1, 1249750, 1249750),
-- Order 2
(2, 30, 'AirPods Pro 2', 1, 6249750, 6249750),
-- Order 3
(3, 23, 'MacBook Air 15" M2', 1, 32499750, 32499750),
(3, 21, 'MacBook Pro 14" M3 Pro', 1, 59999750, 59999750),
-- Order 4
(4, 1, 'iPhone 15 Pro Max', 1, 32499750, 32499750),
-- Order 5
(5, 33, 'Sony WH-1000XM5', 1, 9999750, 9999750),
-- Order 6
(6, 7, 'Samsung Galaxy S24', 1, 21249750, 21249750),
-- Order 7
(7, 23, 'MacBook Air 15" M2', 1, 32499750, 32499750),
(7, 38, 'Anker PowerCore 20000mAh', 1, 1249750, 1249750),
-- Order 8
(8, 31, 'AirPods Max', 1, 13749750, 13749750),
-- Order 9
(9, 35, 'Samsung Galaxy Buds 2 Pro', 1, 5749750, 5749750),
-- Order 10
(10, 24, 'MacBook Air 13" M2', 1, 27499750, 27499750);

-- =====================================================
-- Data Summary
-- =====================================================
SELECT 'Sample data loaded successfully (VND)!' as message;
SELECT 
    (SELECT COUNT(*) FROM categories) as total_categories,
    (SELECT COUNT(*) FROM products) as total_products,
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM orders) as total_orders,
    (SELECT COUNT(*) FROM order_items) as total_order_items;

-- Display category summary
SELECT 
    c.name as category_name,
    COUNT(p.id) as product_count,
    FORMAT(MIN(p.price), 0, 'vi_VN') as min_price_vnd,
    FORMAT(MAX(p.price), 0, 'vi_VN') as max_price_vnd,
    FORMAT(AVG(p.price), 0, 'vi_VN') as avg_price_vnd
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.id, c.name
ORDER BY product_count DESC;
