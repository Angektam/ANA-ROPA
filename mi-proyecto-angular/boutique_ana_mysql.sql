-- =============================================
-- Base de Datos Boutique Ana - MySQL
-- =============================================
-- Script SQL optimizado específicamente para MySQL 8.0+
-- Versión limpia sin comentarios de otros motores

-- =============================================
-- CREACIÓN DE LA BASE DE DATOS
-- =============================================

CREATE DATABASE boutique_ana CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE boutique_ana;

-- =============================================
-- TABLA DE CATEGORÍAS
-- =============================================

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- TABLA DE PRODUCTOS
-- =============================================

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2) NULL,
    image VARCHAR(500) NOT NULL,
    images JSON,
    category_id INT NOT NULL,
    size JSON NOT NULL,
    color JSON NOT NULL,
    brand VARCHAR(100) NOT NULL,
    material VARCHAR(100) NOT NULL,
    is_new BOOLEAN DEFAULT FALSE,
    is_on_sale BOOLEAN DEFAULT FALSE,
    stock INT NOT NULL DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00,
    reviews INT DEFAULT 0,
    tags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    
    INDEX idx_products_category (category_id),
    INDEX idx_products_brand (brand),
    INDEX idx_products_price (price),
    INDEX idx_products_is_new (is_new),
    INDEX idx_products_is_on_sale (is_on_sale),
    INDEX idx_products_rating (rating),
    INDEX idx_products_stock (stock)
);

-- =============================================
-- TABLA DE USUARIOS
-- =============================================

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role ENUM('admin', 'customer') DEFAULT 'customer',
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'México',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
);

-- =============================================
-- TABLA DE DIRECCIONES DE ENVÍO
-- =============================================

CREATE TABLE shipping_addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    street VARCHAR(200) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'México',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_shipping_user (user_id)
);

-- =============================================
-- TABLA DE ÓRDENES
-- =============================================

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    subtotal DECIMAL(10,2) NOT NULL,
    shipping_cost DECIMAL(10,2) DEFAULT 0.00,
    tax DECIMAL(10,2) DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    payment_status VARCHAR(20) DEFAULT 'pending',
    shipping_address_id INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (shipping_address_id) REFERENCES shipping_addresses(id),
    
    INDEX idx_orders_user (user_id),
    INDEX idx_orders_status (status),
    INDEX idx_orders_created (created_at),
    INDEX idx_orders_number (order_number)
);

-- =============================================
-- TABLA DE DETALLES DE ÓRDENES
-- =============================================

CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    selected_size VARCHAR(20),
    selected_color VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    
    INDEX idx_order_items_order (order_id),
    INDEX idx_order_items_product (product_id)
);

-- =============================================
-- TABLA DE CARRITO
-- =============================================

CREATE TABLE cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    selected_size VARCHAR(20),
    selected_color VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_cart_item (user_id, product_id, selected_size, selected_color),
    INDEX idx_cart_user (user_id),
    INDEX idx_cart_product (product_id)
);

-- =============================================
-- TABLA DE RESEÑAS DE PRODUCTOS
-- =============================================

CREATE TABLE product_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    comment TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_product_user_review (product_id, user_id),
    INDEX idx_reviews_product (product_id),
    INDEX idx_reviews_user (user_id)
);

-- =============================================
-- TABLA DE WISHLIST/FAVORITOS
-- =============================================

CREATE TABLE wishlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_wishlist_item (user_id, product_id),
    INDEX idx_wishlist_user (user_id),
    INDEX idx_wishlist_product (product_id)
);

-- =============================================
-- TRIGGERS PARA MYSQL
-- =============================================

-- Trigger para actualizar stock después de una orden
DELIMITER $$
CREATE TRIGGER trigger_update_stock 
    AFTER INSERT ON order_items 
    FOR EACH ROW 
BEGIN
    UPDATE products 
    SET stock = stock - NEW.quantity,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.product_id;
END$$
DELIMITER ;

-- Trigger para generar número de orden único
DELIMITER $$
CREATE TRIGGER trigger_generate_order_number 
    BEFORE INSERT ON orders 
    FOR EACH ROW 
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        SET NEW.order_number = CONCAT('BA-', DATE_FORMAT(CURRENT_DATE, '%Y%m%d'), '-', LPAD(NEW.id, 6, '0'));
    END IF;
END$$
DELIMITER ;

-- =============================================
-- DATOS INICIALES
-- =============================================

-- Insertar categorías
INSERT INTO categories (name, slug, description, image) VALUES
('Vestidos', 'vestidos', 'Elegantes vestidos para toda ocasión', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400'),
('Blusas', 'blusas', 'Blusas cómodas y estilosas', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400'),
('Pantalones', 'pantalones', 'Pantalones de diferentes estilos', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400'),
('Faldas', 'faldas', 'Faldas elegantes y versátiles', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400'),
('Chaquetas', 'chaquetas', 'Chaquetas para completar tu look', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400'),
('Accesorios', 'accesorios', 'Accesorios que marcan la diferencia', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400');

-- Insertar usuarios
INSERT INTO users (name, email, role) VALUES
('Ana García', 'ana@boutiqueana.com', 'admin'),
('María López', 'maria@example.com', 'customer');

-- Insertar productos
INSERT INTO products (name, description, price, original_price, image, images, category_id, size, color, brand, material, is_new, is_on_sale, stock, rating, reviews, tags) VALUES
('Vestido Elegante Negro', 'Vestido de noche elegante en color negro, perfecto para ocasiones especiales. Corte clásico que realza la silueta femenina.', 89.99, 120.00, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', JSON_ARRAY('https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400'), 1, JSON_ARRAY(JSON_OBJECT('name', 'XS', 'available', true), JSON_OBJECT('name', 'S', 'available', true), JSON_OBJECT('name', 'M', 'available', true), JSON_OBJECT('name', 'L', 'available', false), JSON_OBJECT('name', 'XL', 'available', true)), JSON_ARRAY('Negro', 'Azul Marino'), 'Elegance', 'Poliester', false, true, 15, 4.5, 23, JSON_ARRAY('elegante', 'noche', 'negro', 'formal')),

('Blusa Floral Primaveral', 'Blusa ligera con estampado floral, ideal para el día. Tejido suave y cómodo que se adapta a cualquier ocasión.', 45.99, NULL, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400', JSON_ARRAY('https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400'), 2, JSON_ARRAY(JSON_OBJECT('name', 'XS', 'available', true), JSON_OBJECT('name', 'S', 'available', true), JSON_OBJECT('name', 'M', 'available', true), JSON_OBJECT('name', 'L', 'available', true), JSON_OBJECT('name', 'XL', 'available', false)), JSON_ARRAY('Rosa', 'Azul', 'Verde'), 'Spring Collection', 'Algodón', true, false, 8, 4.2, 12, JSON_ARRAY('floral', 'primavera', 'casual', 'cómodo')),

('Pantalón Vaquero Clásico', 'Pantalón vaquero de corte clásico, perfecto para el día a día. Denim de alta calidad con acabados vintage.', 65.99, 80.00, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400', JSON_ARRAY('https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400'), 3, JSON_ARRAY(JSON_OBJECT('name', '24', 'available', true), JSON_OBJECT('name', '26', 'available', true), JSON_OBJECT('name', '28', 'available', true), JSON_OBJECT('name', '30', 'available', false), JSON_OBJECT('name', '32', 'available', true)), JSON_ARRAY('Azul Claro', 'Azul Oscuro'), 'Denim Co.', 'Denim', false, true, 20, 4.7, 45, JSON_ARRAY('vaquero', 'clásico', 'casual', 'denim')),

('Falda Plisada Elegante', 'Falda plisada de longitud media, perfecta para la oficina o eventos semi-formales. Corte que favorece todas las siluetas.', 55.99, NULL, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400', JSON_ARRAY('https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400'), 4, JSON_ARRAY(JSON_OBJECT('name', 'XS', 'available', true), JSON_OBJECT('name', 'S', 'available', true), JSON_OBJECT('name', 'M', 'available', true), JSON_OBJECT('name', 'L', 'available', true), JSON_OBJECT('name', 'XL', 'available', true)), JSON_ARRAY('Negro', 'Gris', 'Azul Marino'), 'Office Style', 'Poliester', true, false, 12, 4.3, 18, JSON_ARRAY('plisada', 'oficina', 'elegante', 'versátil')),

('Chaqueta de Cuero Sintético', 'Chaqueta de cuero sintético con estilo rockero. Perfecta para darle un toque rebelde a cualquier outfit.', 95.99, 130.00, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', JSON_ARRAY('https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400'), 5, JSON_ARRAY(JSON_OBJECT('name', 'XS', 'available', false), JSON_OBJECT('name', 'S', 'available', true), JSON_OBJECT('name', 'M', 'available', true), JSON_OBJECT('name', 'L', 'available', true), JSON_OBJECT('name', 'XL', 'available', true)), JSON_ARRAY('Negro', 'Marrón'), 'Rock Style', 'Cuero Sintético', false, true, 6, 4.8, 31, JSON_ARRAY('cuero', 'rockero', 'rebelde', 'invierno')),

('Bolso Elegante de Cuero', 'Bolso de mano elegante en cuero genuino. Diseño atemporal que complementa cualquier look.', 75.99, NULL, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', JSON_ARRAY('https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400'), 6, JSON_ARRAY(JSON_OBJECT('name', 'Único', 'available', true)), JSON_ARRAY('Negro', 'Marrón', 'Beige'), 'Luxury Bags', 'Cuero Genuino', true, false, 10, 4.6, 27, JSON_ARRAY('bolso', 'cuero', 'elegante', 'accesorio')),

('Vestido de Verano Floral', 'Vestido ligero y fresco con estampado floral, perfecto para los días cálidos de verano.', 52.99, NULL, 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400', JSON_ARRAY('https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400'), 1, JSON_ARRAY(JSON_OBJECT('name', 'XS', 'available', true), JSON_OBJECT('name', 'S', 'available', true), JSON_OBJECT('name', 'M', 'available', true), JSON_OBJECT('name', 'L', 'available', true), JSON_OBJECT('name', 'XL', 'available', true)), JSON_ARRAY('Rosa', 'Azul', 'Amarillo'), 'Summer Vibes', 'Algodón', true, false, 18, 4.4, 15, JSON_ARRAY('verano', 'floral', 'ligero', 'fresco')),

('Blusa de Seda Elegante', 'Blusa de seda natural con corte elegante, perfecta para ocasiones especiales y eventos de trabajo.', 78.99, 95.00, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400', JSON_ARRAY('https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400'), 2, JSON_ARRAY(JSON_OBJECT('name', 'XS', 'available', true), JSON_OBJECT('name', 'S', 'available', true), JSON_OBJECT('name', 'M', 'available', true), JSON_OBJECT('name', 'L', 'available', false), JSON_OBJECT('name', 'XL', 'available', true)), JSON_ARRAY('Blanco', 'Negro', 'Azul Marino'), 'Luxury Collection', 'Seda', false, true, 7, 4.9, 22, JSON_ARRAY('seda', 'elegante', 'formal', 'lujo'));

-- =============================================
-- VISTAS ÚTILES
-- =============================================

-- Vista de productos con información de categoría
CREATE VIEW products_with_category AS
SELECT 
    p.*,
    c.name as category_name,
    c.slug as category_slug,
    c.description as category_description
FROM products p
LEFT JOIN categories c ON p.category_id = c.id;

-- Vista de órdenes con información del usuario
CREATE VIEW orders_with_user AS
SELECT 
    o.*,
    u.name as user_name,
    u.email as user_email
FROM orders o
LEFT JOIN users u ON o.user_id = u.id;

-- Vista de productos más vendidos
CREATE VIEW best_selling_products AS
SELECT 
    p.id,
    p.name,
    p.price,
    p.image,
    COALESCE(SUM(oi.quantity), 0) as total_sold,
    COUNT(DISTINCT oi.order_id) as total_orders
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id, p.name, p.price, p.image
ORDER BY total_sold DESC;

-- Vista de estadísticas de productos
CREATE VIEW product_stats AS
SELECT 
    p.id,
    p.name,
    p.price,
    p.stock,
    p.rating,
    p.reviews,
    COUNT(oi.id) as times_ordered,
    COALESCE(SUM(oi.quantity), 0) as total_quantity_sold,
    COUNT(pr.id) as total_reviews,
    AVG(pr.rating) as avg_rating
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN product_reviews pr ON p.id = pr.product_id
GROUP BY p.id, p.name, p.price, p.stock, p.rating, p.reviews;

-- =============================================
-- PROCEDIMIENTOS ALMACENADOS ÚTILES
-- =============================================

-- Procedimiento para buscar productos por texto
DELIMITER $$
CREATE PROCEDURE SearchProducts(IN search_term VARCHAR(255))
BEGIN
    SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.image,
        c.name as category_name,
        p.rating
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE 
        p.name LIKE CONCAT('%', search_term, '%') OR
        p.description LIKE CONCAT('%', search_term, '%') OR
        p.brand LIKE CONCAT('%', search_term, '%') OR
        JSON_SEARCH(p.tags, 'one', CONCAT('%', search_term, '%')) IS NOT NULL
    ORDER BY p.rating DESC, p.name;
END$$
DELIMITER ;

-- Procedimiento para obtener productos por categoría
DELIMITER $$
CREATE PROCEDURE GetProductsByCategory(IN category_slug VARCHAR(100))
BEGIN
    SELECT 
        p.id,
        p.name,
        p.price,
        p.image,
        p.is_new,
        p.is_on_sale,
        p.rating
    FROM products p
    INNER JOIN categories c ON p.category_id = c.id
    WHERE c.slug = category_slug
    ORDER BY p.created_at DESC;
END$$
DELIMITER ;

-- Procedimiento para obtener estadísticas de ventas
DELIMITER $$
CREATE PROCEDURE GetSalesStats(IN start_date DATE, IN end_date DATE)
BEGIN
    SELECT 
        DATE(o.created_at) as sale_date,
        COUNT(DISTINCT o.id) as total_orders,
        SUM(o.total) as total_revenue,
        SUM(oi.quantity) as total_items_sold
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE DATE(o.created_at) BETWEEN start_date AND end_date
    GROUP BY DATE(o.created_at)
    ORDER BY sale_date;
END$$
DELIMITER ;

-- =============================================
-- FUNCIONES ÚTILES
-- =============================================

-- Función para calcular descuento
DELIMITER $$
CREATE FUNCTION CalculateDiscount(original_price DECIMAL(10,2), current_price DECIMAL(10,2))
RETURNS DECIMAL(5,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE discount DECIMAL(5,2);
    IF original_price IS NULL OR original_price <= 0 THEN
        RETURN 0;
    END IF;
    
    SET discount = ((original_price - current_price) / original_price) * 100;
    RETURN ROUND(discount, 2);
END$$
DELIMITER ;

-- Función para verificar si un producto está en stock
DELIMITER $$
CREATE FUNCTION IsProductInStock(product_id INT, requested_quantity INT)
RETURNS BOOLEAN
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE current_stock INT;
    SELECT stock INTO current_stock FROM products WHERE id = product_id;
    
    IF current_stock IS NULL THEN
        RETURN FALSE;
    END IF;
    
    RETURN current_stock >= requested_quantity;
END$$
DELIMITER ;

-- =============================================
-- COMENTARIOS FINALES
-- =============================================

-- Script MySQL optimizado para Boutique Ana
-- Incluye:
-- - Estructura completa de tablas con índices
-- - Triggers automáticos para MySQL
-- - Vistas útiles para consultas complejas
-- - Procedimientos almacenados para operaciones comunes
-- - Funciones personalizadas
-- - Datos iniciales con JSON nativo de MySQL
--
-- Para ejecutar:
-- 1. mysql -u root -p < boutique_ana_mysql.sql
-- 2. O ejecutar línea por línea en MySQL Workbench
--
-- Características MySQL utilizadas:
-- - AUTO_INCREMENT para claves primarias
-- - ENUM para valores limitados
-- - JSON nativo con funciones JSON_*
-- - Triggers con DELIMITER
-- - Procedimientos almacenados
-- - Funciones personalizadas
-- - Vistas para consultas complejas
--
-- Compatible con MySQL 8.0+
-- Recomendado usar MySQL 8.0 o superior para mejor soporte JSON