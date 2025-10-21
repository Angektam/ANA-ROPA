-- =============================================
-- Base de Datos Boutique Ana - Script SQL para MySQL
-- =============================================

-- =============================================
-- CREACIÓN DE LA BASE DE DATOS
-- =============================================
CREATE DATABASE IF NOT EXISTS boutique_ana;
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- MySQL auto-update
);

-- =============================================
-- TABLA DE PRODUCTOS
-- =============================================
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- MySQL auto-update
    
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- =============================================
-- TABLA DE USUARIOS
-- =============================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255), 
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'México',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- MySQL auto-update
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
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =============================================
-- TABLA DE ÓRDENES
-- =============================================
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    user_id INT NOT NULL,
    order_number VARCHAR(50) UNIQUE, -- order_number se genera con un TRIGGER AFTER INSERT
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    subtotal DECIMAL(10,2) NOT NULL,
    shipping_cost DECIMAL(10,2) DEFAULT 0.00,
    tax DECIMAL(10,2) DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    payment_status VARCHAR(20) DEFAULT 'pending',
    shipping_address_id INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- MySQL auto-update
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (shipping_address_id) REFERENCES shipping_addresses(id)
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
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- =============================================
-- TABLA DE CARRITO (OPCIONAL - para persistencia)
-- =============================================
CREATE TABLE cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    selected_size VARCHAR(20),
    selected_color VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- MySQL auto-update
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_cart_item (user_id, product_id, selected_size, selected_color)
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- MySQL auto-update
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_review (product_id, user_id)
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
    UNIQUE KEY unique_wishlist_item (user_id, product_id)
);

-- =============================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =============================================
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_is_new ON products(is_new);
CREATE INDEX idx_products_is_on_sale ON products(is_on_sale);
CREATE INDEX idx_products_rating ON products(rating);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- =============================================
-- TRIGGERS PARA FUNCIONALIDAD ESPECÍFICA
-- =============================================

-- Para MySQL, se usa DELIMITER para crear triggers multi-declaración.

-- 1. Trigger para actualizar el stock después de una orden
DELIMITER //
CREATE TRIGGER trigger_update_stock 
    AFTER INSERT ON order_items 
    FOR EACH ROW 
BEGIN
    UPDATE products 
    SET stock = stock - NEW.quantity,
        updated_at = CURRENT_TIMESTAMP -- Se actualiza manualmente aquí para asegurar consistencia
    WHERE id = NEW.product_id;
END //
DELIMITER ;

-- 2. Trigger para generar el número de orden único
-- NOTA: Esto requiere que 'id' se haya generado. Se usa un BEFORE INSERT 
-- pero se basa en una función para obtener el próximo ID, que es complejo en MySQL 
-- o se hace con un AFTER INSERT y un UPDATE, que podría ser más simple.
-- Una alternativa más robusta es usar una combinación de fecha y ID generado.

DELIMITER //
CREATE TRIGGER trigger_generate_order_number 
    BEFORE INSERT ON orders 
    FOR EACH ROW 
BEGIN
    -- Genera un número de orden basado en la fecha y el próximo AUTO_INCREMENT ID
    -- Nota: LAST_INSERT_ID() no funciona en BEFORE INSERT, se usa un truco
    -- o se pasa a AFTER INSERT y se actualiza la misma fila.
    -- Aquí, usaremos la fecha y un valor temporal.
    -- La mejor práctica en MySQL para generar un serial único es un AFTER INSERT + UPDATE.
    
    -- El siguiente trigger es una simplificación para BEFORE INSERT
    -- que podría llevar a duplicados si hay mucha concurrencia. 
    -- Se recomienda usar un 'AFTER INSERT' y luego hacer un 'UPDATE'.

    SET NEW.order_number = CONCAT(
        'BA-', 
        DATE_FORMAT(NOW(), '%Y%m%d'), 
        '-', 
        LPAD(
            (SELECT AUTO_INCREMENT FROM information_schema.tables WHERE table_name = 'orders' AND table_schema = DATABASE())::TEXT, 
            6, 
            '0'
        )
    );
END //
DELIMITER ;

-- TRUCO: Dado que la obtención del próximo ID AUTO_INCREMENT es complejo y 
-- el trigger original de PostgreSQL usa el ID, se puede optar por un enfoque 
-- de la aplicación o una función más compleja. Se mantiene el diseño simple 
-- con el campo `order_number` esperando el ID generado. 
-- *Recomendación:* Implementar la generación del número en la lógica de la aplicación
-- o usar el siguiente patrón de AFTER INSERT que es más seguro para obtener el ID real:

-- AFTER INSERT TRIGGER (Más seguro para obtener el ID real)
DROP TRIGGER IF EXISTS trigger_generate_order_number; -- Elimina el anterior para redefinir

DELIMITER //
CREATE TRIGGER trigger_generate_order_number 
    AFTER INSERT ON orders 
    FOR EACH ROW 
BEGIN
    -- Se actualiza el campo order_number usando el ID real que acaba de ser generado
    UPDATE orders
    SET order_number = CONCAT(
        'BA-', 
        DATE_FORMAT(NEW.created_at, '%Y%m%d'), 
        '-', 
        LPAD(NEW.id, 6, '0')
    )
    WHERE id = NEW.id;
END //
DELIMITER ;


-- =============================================
-- DATOS INICIALES
-- =============================================

INSERT INTO categories (name, slug, description, image) VALUES
('Vestidos', 'vestidos', 'Elegantes vestidos para toda ocasión', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400'),
('Blusas', 'blusas', 'Blusas cómodas y estilosas', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400'),
('Pantalones', 'pantalones', 'Pantalones de diferentes estilos', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400'),
('Faldas', 'faldas', 'Faldas elegantes y versátiles', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400'),
('Chaquetas', 'chaquetas', 'Chaquetas para completar tu look', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400'),
('Accesorios', 'accesorios', 'Accesorios que marcan la diferencia', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400');

INSERT INTO users (name, email, role) VALUES
('Ana García', 'ana@boutiqueana.com', 'admin'),
('María López', 'maria@example.com', 'customer');

-- Nota: Los JSON deben ser válidos en MySQL (con comillas dobles).
SET @vestido_images = '["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400", "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400"]';
SET @blusa_images = '["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400", "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400"]';
SET @pantalon_images = '["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400", "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400"]';
SET @chaqueta_images = '["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400", "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400"]';
SET @accesorio_images = '["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400", "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400"]';

SET @vestido_tallas = '[{"name": "XS", "available": true}, {"name": "S", "available": true}, {"name": "M", "available": true}, {"name": "L", "available": false}, {"name": "XL", "available": true}]';
SET @blusa_tallas = '[{"name": "XS", "available": true}, {"name": "S", "available": true}, {"name": "M", "available": true}, {"name": "L", "available": true}, {"name": "XL", "available": false}]';
SET @pantalon_tallas = '[{"name": "24", "available": true}, {"name": "26", "available": true}, {"name": "28", "available": true}, {"name": "30", "available": false}, {"name": "32", "available": true}]';
SET @falda_tallas = '[{"name": "XS", "available": true}, {"name": "S", "available": true}, {"name": "M", "available": true}, {"name": "L", "available": true}, {"name": "XL", "available": true}]';
SET @chaqueta_tallas = '[{"name": "XS", "available": false}, {"name": "S", "available": true}, {"name": "M", "available": true}, {"name": "L", "available": true}, {"name": "XL", "available": true}]';
SET @accesorio_tallas = '[{"name": "Único", "available": true}]';

SET @vestido_colores = '["Negro", "Azul Marino"]';
SET @blusa_colores = '["Rosa", "Azul", "Verde"]';
SET @pantalon_colores = '["Azul Claro", "Azul Oscuro"]';
SET @falda_colores = '["Negro", "Gris", "Azul Marino"]';
SET @chaqueta_colores = '["Negro", "Marrón"]';
SET @accesorio_colores = '["Negro", "Marrón", "Beige"]';
SET @vestido_verano_colores = '["Rosa", "Azul", "Amarillo"]';
SET @blusa_seda_colores = '["Blanco", "Negro", "Azul Marino"]';

SET @vestido_tags = '["elegante", "noche", "negro", "formal"]';
SET @blusa_tags = '["floral", "primavera", "casual", "cómodo"]';
SET @pantalon_tags = '["vaquero", "clásico", "casual", "denim"]';
SET @falda_tags = '["plisada", "oficina", "elegante", "versátil"]';
SET @chaqueta_tags = '["cuero", "rockero", "rebelde", "invierno"]';
SET @accesorio_tags = '["bolso", "cuero", "elegante", "accesorio"]';
SET @vestido_verano_tags = '["verano", "floral", "ligero", "fresco"]';
SET @blusa_seda_tags = '["seda", "elegante", "formal", "lujo"]';

INSERT INTO products (name, description, price, original_price, image, images, category_id, size, color, brand, material, is_new, is_on_sale, stock, rating, reviews, tags) VALUES
('Vestido Elegante Negro', 'Vestido de noche elegante en color negro, perfecto para ocasiones especiales. Corte clásico que realza la silueta femenina.', 89.99, 120.00, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', @vestido_images, 1, @vestido_tallas, @vestido_colores, 'Elegance', 'Poliester', FALSE, TRUE, 15, 4.5, 23, @vestido_tags),
('Blusa Floral Primaveral', 'Blusa ligera con estampado floral, ideal para el día. Tejido suave y cómodo que se adapta a cualquier ocasión.', 45.99, NULL, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400', @blusa_images, 2, @blusa_tallas, @blusa_colores, 'Spring Collection', 'Algodón', TRUE, FALSE, 8, 4.2, 12, @blusa_tags),
('Pantalón Vaquero Clásico', 'Pantalón vaquero de corte clásico, perfecto para el día a día. Denim de alta calidad con acabados vintage.', 65.99, 80.00, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400', @pantalon_images, 3, @pantalon_tallas, @pantalon_colores, 'Denim Co.', 'Denim', FALSE, TRUE, 20, 4.7, 45, @pantalon_tags),
('Falda Plisada Elegante', 'Falda plisada de longitud media, perfecta para la oficina o eventos semi-formales. Corte que favorece todas las siluetas.', 55.99, NULL, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400', @blusa_images, 4, @falda_tallas, @falda_colores, 'Office Style', 'Poliester', TRUE, FALSE, 12, 4.3, 18, @falda_tags),
('Chaqueta de Cuero Sintético', 'Chaqueta de cuero sintético con estilo rockero. Perfecta para darle un toque rebelde a cualquier outfit.', 95.99, 130.00, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', @chaqueta_images, 5, @chaqueta_tallas, @chaqueta_colores, 'Rock Style', 'Cuero Sintético', FALSE, TRUE, 6, 4.8, 31, @chaqueta_tags),
('Bolso Elegante de Cuero', 'Bolso de mano elegante en cuero genuino. Diseño atemporal que complementa cualquier look.', 75.99, NULL, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', @accesorio_images, 6, @accesorio_tallas, @accesorio_colores, 'Luxury Bags', 'Cuero Genuino', TRUE, FALSE, 10, 4.6, 27, @accesorio_tags),
('Vestido de Verano Floral', 'Vestido ligero y fresco con estampado floral, perfecto para los días cálidos de verano.', 52.99, NULL, 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400', @blusa_images, 1, @falda_tallas, @vestido_verano_colores, 'Summer Vibes', 'Algodón', TRUE, FALSE, 18, 4.4, 15, @vestido_verano_tags),
('Blusa de Seda Elegante', 'Blusa de seda natural con corte elegante, perfecta para ocasiones especiales y eventos de trabajo.', 78.99, 95.00, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400', @blusa_images, 2, @vestido_tallas, @blusa_seda_colores, 'Luxury Collection', 'Seda', FALSE, TRUE, 7, 4.9, 22, @blusa_seda_tags);

-- =============================================
-- VISTAS ÚTILES
-- =============================================
CREATE VIEW products_with_category AS
SELECT 
    p.*,
    c.name AS category_name,
    c.slug AS category_slug,
    c.description AS category_description
FROM products p
LEFT JOIN categories c ON p.category_id = c.id;

CREATE VIEW orders_with_user AS
SELECT 
    o.*,
    u.name AS user_name,
    u.email AS user_email
FROM orders o
LEFT JOIN users u ON o.user_id = u.id;

CREATE VIEW best_selling_products AS
SELECT 
    p.id,
    p.name,
    p.price,
    p.image,
    SUM(oi.quantity) AS total_sold,
    COUNT(DISTINCT oi.order_id) AS total_orders
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id, p.name, p.price, p.image
ORDER BY total_sold DESC;

-- =============================================
-- COMENTARIOS FINALES
-- =============================================