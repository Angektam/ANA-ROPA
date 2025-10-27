-- =============================================
-- Base de Datos Boutique Ana - PostgreSQL
-- =============================================
-- Script SQL optimizado específicamente para PostgreSQL
-- Versión limpia sin comentarios de otros motores

-- =============================================
-- CREACIÓN DE LA BASE DE DATOS
-- =============================================

CREATE DATABASE boutique_ana;
\c boutique_ana;

-- =============================================
-- TABLA DE CATEGORÍAS
-- =============================================

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABLA DE PRODUCTOS
-- =============================================

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    image VARCHAR(500) NOT NULL,
    images JSONB,
    category_id INT NOT NULL,
    size JSONB NOT NULL,
    color JSONB NOT NULL,
    brand VARCHAR(100) NOT NULL,
    material VARCHAR(100) NOT NULL,
    is_new BOOLEAN DEFAULT FALSE,
    is_on_sale BOOLEAN DEFAULT FALSE,
    stock INT NOT NULL DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00,
    reviews INT DEFAULT 0,
    tags JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- =============================================
-- TABLA DE USUARIOS
-- =============================================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABLA DE DIRECCIONES DE ENVÍO
-- =============================================

CREATE TABLE shipping_addresses (
    id SERIAL PRIMARY KEY,
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
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (shipping_address_id) REFERENCES shipping_addresses(id)
);

-- =============================================
-- TABLA DE DETALLES DE ÓRDENES
-- =============================================

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
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
-- TABLA DE CARRITO
-- =============================================

CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    selected_size VARCHAR(20),
    selected_color VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE(user_id, product_id, selected_size, selected_color)
);

-- =============================================
-- TABLA DE RESEÑAS DE PRODUCTOS
-- =============================================

CREATE TABLE product_reviews (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    comment TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(product_id, user_id)
);

-- =============================================
-- TABLA DE WISHLIST/FAVORITOS
-- =============================================

CREATE TABLE wishlist (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE(user_id, product_id)
);

-- =============================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =============================================

-- Índices para productos
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_is_new ON products(is_new);
CREATE INDEX idx_products_is_on_sale ON products(is_on_sale);
CREATE INDEX idx_products_rating ON products(rating);
CREATE INDEX idx_products_stock ON products(stock);

-- Índices para órdenes
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at);
CREATE INDEX idx_orders_number ON orders(order_number);

-- Índices para usuarios
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Índices para carrito
CREATE INDEX idx_cart_user ON cart_items(user_id);
CREATE INDEX idx_cart_product ON cart_items(product_id);

-- Índices JSONB para PostgreSQL
CREATE INDEX idx_products_size ON products USING GIN (size);
CREATE INDEX idx_products_color ON products USING GIN (color);
CREATE INDEX idx_products_tags ON products USING GIN (tags);

-- =============================================
-- FUNCIONES Y TRIGGERS
-- =============================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at 
    BEFORE UPDATE ON cart_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_reviews_updated_at 
    BEFORE UPDATE ON product_reviews 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para actualizar stock automáticamente
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products 
    SET stock = stock - NEW.quantity,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.product_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_stock 
    AFTER INSERT ON order_items 
    FOR EACH ROW 
    EXECUTE FUNCTION update_product_stock();

-- Función para generar número de orden único
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number := 'BA-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(NEW.id::TEXT, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_order_number 
    BEFORE INSERT ON orders 
    FOR EACH ROW 
    EXECUTE FUNCTION generate_order_number();

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
('Vestido Elegante Negro', 'Vestido de noche elegante en color negro, perfecto para ocasiones especiales. Corte clásico que realza la silueta femenina.', 89.99, 120.00, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', '["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400", "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400"]', 1, '[{"name": "XS", "available": true}, {"name": "S", "available": true}, {"name": "M", "available": true}, {"name": "L", "available": false}, {"name": "XL", "available": true}]', '["Negro", "Azul Marino"]', 'Elegance', 'Poliester', false, true, 15, 4.5, 23, '["elegante", "noche", "negro", "formal"]'),

('Blusa Floral Primaveral', 'Blusa ligera con estampado floral, ideal para el día. Tejido suave y cómodo que se adapta a cualquier ocasión.', 45.99, NULL, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400', '["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400", "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400"]', 2, '[{"name": "XS", "available": true}, {"name": "S", "available": true}, {"name": "M", "available": true}, {"name": "L", "available": true}, {"name": "XL", "available": false}]', '["Rosa", "Azul", "Verde"]', 'Spring Collection', 'Algodón', true, false, 8, 4.2, 12, '["floral", "primavera", "casual", "cómodo"]'),

('Pantalón Vaquero Clásico', 'Pantalón vaquero de corte clásico, perfecto para el día a día. Denim de alta calidad con acabados vintage.', 65.99, 80.00, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400', '["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400", "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400"]', 3, '[{"name": "24", "available": true}, {"name": "26", "available": true}, {"name": "28", "available": true}, {"name": "30", "available": false}, {"name": "32", "available": true}]', '["Azul Claro", "Azul Oscuro"]', 'Denim Co.', 'Denim', false, true, 20, 4.7, 45, '["vaquero", "clásico", "casual", "denim"]'),

('Falda Plisada Elegante', 'Falda plisada de longitud media, perfecta para la oficina o eventos semi-formales. Corte que favorece todas las siluetas.', 55.99, NULL, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400', '["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400", "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400"]', 4, '[{"name": "XS", "available": true}, {"name": "S", "available": true}, {"name": "M", "available": true}, {"name": "L", "available": true}, {"name": "XL", "available": true}]', '["Negro", "Gris", "Azul Marino"]', 'Office Style', 'Poliester', true, false, 12, 4.3, 18, '["plisada", "oficina", "elegante", "versátil"]'),

('Chaqueta de Cuero Sintético', 'Chaqueta de cuero sintético con estilo rockero. Perfecta para darle un toque rebelde a cualquier outfit.', 95.99, 130.00, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', '["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400", "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400"]', 5, '[{"name": "XS", "available": false}, {"name": "S", "available": true}, {"name": "M", "available": true}, {"name": "L", "available": true}, {"name": "XL", "available": true}]', '["Negro", "Marrón"]', 'Rock Style', 'Cuero Sintético', false, true, 6, 4.8, 31, '["cuero", "rockero", "rebelde", "invierno"]'),

('Bolso Elegante de Cuero', 'Bolso de mano elegante en cuero genuino. Diseño atemporal que complementa cualquier look.', 75.99, NULL, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', '["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400", "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400"]', 6, '[{"name": "Único", "available": true}]', '["Negro", "Marrón", "Beige"]', 'Luxury Bags', 'Cuero Genuino', true, false, 10, 4.6, 27, '["bolso", "cuero", "elegante", "accesorio"]'),

('Vestido de Verano Floral', 'Vestido ligero y fresco con estampado floral, perfecto para los días cálidos de verano.', 52.99, NULL, 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400', '["https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400", "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400"]', 1, '[{"name": "XS", "available": true}, {"name": "S", "available": true}, {"name": "M", "available": true}, {"name": "L", "available": true}, {"name": "XL", "available": true}]', '["Rosa", "Azul", "Amarillo"]', 'Summer Vibes', 'Algodón', true, false, 18, 4.4, 15, '["verano", "floral", "ligero", "fresco"]'),

('Blusa de Seda Elegante', 'Blusa de seda natural con corte elegante, perfecta para ocasiones especiales y eventos de trabajo.', 78.99, 95.00, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400', '["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400", "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400"]', 2, '[{"name": "XS", "available": true}, {"name": "S", "available": true}, {"name": "M", "available": true}, {"name": "L", "available": false}, {"name": "XL", "available": true}]', '["Blanco", "Negro", "Azul Marino"]', 'Luxury Collection', 'Seda', false, true, 7, 4.9, 22, '["seda", "elegante", "formal", "lujo"]');

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
-- FUNCIONES ÚTILES
-- =============================================

-- Función para buscar productos por texto
CREATE OR REPLACE FUNCTION search_products(search_term TEXT)
RETURNS TABLE (
    id INT,
    name VARCHAR(200),
    description TEXT,
    price DECIMAL(10,2),
    image VARCHAR(500),
    category_name VARCHAR(100),
    rating DECIMAL(3,2)
) AS $$
BEGIN
    RETURN QUERY
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
        p.name ILIKE '%' || search_term || '%' OR
        p.description ILIKE '%' || search_term || '%' OR
        p.brand ILIKE '%' || search_term || '%' OR
        p.tags::TEXT ILIKE '%' || search_term || '%'
    ORDER BY p.rating DESC, p.name;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener productos por categoría
CREATE OR REPLACE FUNCTION get_products_by_category(category_slug TEXT)
RETURNS TABLE (
    id INT,
    name VARCHAR(200),
    price DECIMAL(10,2),
    image VARCHAR(500),
    is_new BOOLEAN,
    is_on_sale BOOLEAN,
    rating DECIMAL(3,2)
) AS $$
BEGIN
    RETURN QUERY
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
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- COMENTARIOS FINALES
-- =============================================

-- Script PostgreSQL optimizado para Boutique Ana
-- Incluye:
-- - Estructura completa de tablas
-- - Índices optimizados para PostgreSQL
-- - Triggers automáticos
-- - Vistas útiles
-- - Funciones de búsqueda
-- - Datos iniciales
--
-- Para ejecutar:
-- 1. psql -U postgres -f boutique_ana_postgresql.sql
-- 2. O ejecutar línea por línea en pgAdmin
--
-- Características PostgreSQL utilizadas:
-- - JSONB para mejor rendimiento con JSON
-- - Índices GIN para búsquedas en JSONB
-- - Funciones PL/pgSQL
-- - Triggers automáticos
-- - Vistas materializadas (opcional)