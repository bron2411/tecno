-- ==========================================
-- SCRIPT DE CREACIÓN DE TABLAS - TECNOINNOVA
-- Para ejecutar en el SQL Editor de Supabase
-- ==========================================

-- 1. Tabla de Productos (Inventario)
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  reserved INTEGER NOT NULL DEFAULT 0
);

-- 2. Tabla de Técnicos
CREATE TABLE technicians (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Disponible', 'Ocupado')) DEFAULT 'Disponible'
);

-- 3. Tabla de Pedidos (Órdenes)
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  client_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  service_type TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'PENDIENTE',
  date_requested TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  technically_feasible BOOLEAN DEFAULT false,
  financially_cleared BOOLEAN DEFAULT false,
  technician_id TEXT REFERENCES technicians(id),
  scheduled_date DATE,
  satisfaction_level TEXT,
  post_sale_notes TEXT,
  requested_products JSONB
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Crear políticas para permitir lectura/escritura a usuarios autenticados
CREATE POLICY "Permitir todo a usuarios autenticados" ON products FOR ALL TO authenticated USING (true);
CREATE POLICY "Permitir todo a usuarios autenticados" ON technicians FOR ALL TO authenticated USING (true);
CREATE POLICY "Permitir todo a usuarios autenticados" ON orders FOR ALL TO authenticated USING (true);

-- Política para permitir que usuarios anónimos puedan insertar órdenes (Client Portal)
CREATE POLICY "Permitir inserción anónima de pedidos" ON orders FOR INSERT TO anon WITH CHECK (true);

-- ==========================================
-- DATOS DE PRUEBA (15 REGISTROS POR TABLA)
-- ==========================================

-- Insertar 15 Productos
INSERT INTO products (id, name, stock, reserved) VALUES
('P-001', 'Cámara IP 4K Hikvision', 50, 36),
('P-002', 'Sensor de Movimiento PIR', 120, 8),
('P-003', 'Panel de Alarma DSC Neo', 30, 2),
('P-004', 'Cable UTP Cat 6 (Bobina)', 15, 0),
('P-005', 'Disco Duro Púrpura 4TB', 40, 5),
('P-006', 'Sirena Exterior 30W', 60, 1),
('P-007', 'Contacto Magnético Puerta/Ventana', 200, 4),
('P-008', 'Cámara Domo PTZ 360', 10, 0),
('P-009', 'Videoportero IP', 25, 0),
('P-010', 'Control de Acceso Biométrico', 20, 0),
('P-011', 'Fuente de Poder 12V 5A', 80, 5),
('P-012', 'Balun de Video HD (Par)', 150, 0),
('P-013', 'Batería de Respaldo 12V 7Ah', 45, 0),
('P-014', 'Cerradura Electromagnética', 35, 0),
('P-015', 'Botón de Pánico Inalámbrico', 55, 0);

-- Insertar 15 Técnicos
INSERT INTO technicians (id, name, status) VALUES
('T-001', 'Carlos Méndez', 'Disponible'),
('T-002', 'Roberto Suárez', 'Ocupado'),
('T-003', 'Andrés Vilela', 'Disponible'),
('T-004', 'Miguel Santos', 'Ocupado'),
('T-005', 'José Delgado', 'Disponible'),
('T-006', 'Luis Paredes', 'Disponible'),
('T-007', 'Juan Carlos Ruiz', 'Ocupado'),
('T-008', 'Ricardo Pinto', 'Disponible'),
('T-009', 'Fernando León', 'Disponible'),
('T-010', 'Eduardo Torres', 'Ocupado'),
('T-011', 'Mario Cárdenas', 'Disponible'),
('T-012', 'Diego Castro', 'Disponible'),
('T-013', 'Héctor Silva', 'Ocupado'),
('T-014', 'Oscar Ramírez', 'Disponible'),
('T-015', 'Gabriel Vargas', 'Disponible');

-- Insertar 15 Pedidos
INSERT INTO orders (id, client_name, phone, address, service_type, details, status, date_requested, technically_feasible, financially_cleared, technician_id, scheduled_date, satisfaction_level, post_sale_notes, requested_products) VALUES
('ORD-101', 'Empresa Alpha', '555-0101', 'Av. Principal 123', 'CCTV 8 Cámaras', 'Instalación en almacén', 'PENDIENTE', now() - interval '1 day', false, false, NULL, NULL, NULL, NULL, '[{"productId": "P-001", "quantity": 8, "name": "Cámara IP 4K Hikvision"}, {"productId": "P-005", "quantity": 1, "name": "Disco Duro Púrpura 4TB"}]'::jsonb),
('ORD-102', 'Residencial Los Pinos', '555-0102', 'Calle Sur 45', 'Alarma Residencial', 'Casa de 2 pisos', 'APROBADO', now() - interval '2 days', true, true, NULL, NULL, NULL, NULL, '[{"productId": "P-003", "quantity": 1, "name": "Panel de Alarma DSC Neo"}, {"productId": "P-002", "quantity": 3, "name": "Sensor de Movimiento PIR"}, {"productId": "P-007", "quantity": 2, "name": "Contacto Magnético Puerta/Ventana"}]'::jsonb),
('ORD-103', 'Tienda El Sol', '555-0103', 'Centro Comercial local 5', 'CCTV 4 Cámaras', 'Cámaras ocultas', 'PROGRAMADO', now() - interval '3 days', true, true, 'T-002', CURRENT_DATE + interval '1 day', NULL, NULL, '[{"productId": "P-001", "quantity": 4, "name": "Cámara IP 4K Hikvision"}, {"productId": "P-005", "quantity": 1, "name": "Disco Duro Púrpura 4TB"}, {"productId": "P-011", "quantity": 1, "name": "Fuente de Poder 12V 5A"}]'::jsonb),
('ORD-104', 'Banco Central', '555-0104', 'Av. Financiera 90', 'Control de Acceso', 'Huella digital para bóveda', 'COMPLETADO', now() - interval '5 days', true, true, 'T-004', CURRENT_DATE - interval '1 day', NULL, NULL, '[{"productId": "P-010", "quantity": 1, "name": "Control de Acceso Biométrico"}, {"productId": "P-014", "quantity": 1, "name": "Cerradura Electromagnética"}]'::jsonb),
('ORD-105', 'Clínica Salud', '555-0105', 'Av. Medicina 10', 'CCTV 16 Cámaras', 'Monitoreo de pasillos', 'FACTURADO', now() - interval '10 days', true, true, 'T-001', CURRENT_DATE - interval '5 days', NULL, NULL, '[{"productId": "P-001", "quantity": 16, "name": "Cámara IP 4K Hikvision"}, {"productId": "P-005", "quantity": 2, "name": "Disco Duro Púrpura 4TB"}]'::jsonb),
('ORD-106', 'Colegio San Marcos', '555-0106', 'Calle Educación 2', 'Videoportero', 'Para la puerta principal', 'POSTVENTA_COMPLETADA', now() - interval '20 days', true, true, 'T-003', CURRENT_DATE - interval '15 days', 'Bueno', 'Cliente muy satisfecho', '[{"productId": "P-009", "quantity": 1, "name": "Videoportero IP"}]'::jsonb),
('ORD-107', 'Constructora Nova', '555-0107', 'Av. Obras 40', 'Alarma Contra Incendio', 'Edificio en construcción', 'RECHAZADO', now() - interval '1 day', false, true, NULL, NULL, NULL, NULL, '[{"productId": "P-003", "quantity": 1, "name": "Panel de Alarma DSC Neo"}, {"productId": "P-002", "quantity": 5, "name": "Sensor de Movimiento PIR"}]'::jsonb),
('ORD-108', 'Gimnasio Fit', '555-0108', 'Plaza Norte 8', 'Control de Acceso', 'Torniquetes', 'PENDIENTE', now(), false, false, NULL, NULL, NULL, NULL, '[{"productId": "P-010", "quantity": 2, "name": "Control de Acceso Biométrico"}]'::jsonb),
('ORD-109', 'Supermercado Todo', '555-0109', 'Av. Comercio 100', 'CCTV 32 Cámaras', 'Almacén y cajas', 'APROBADO', now() - interval '1 day', true, true, NULL, NULL, NULL, NULL, '[{"productId": "P-001", "quantity": 32, "name": "Cámara IP 4K Hikvision"}, {"productId": "P-005", "quantity": 4, "name": "Disco Duro Púrpura 4TB"}, {"productId": "P-011", "quantity": 4, "name": "Fuente de Poder 12V 5A"}]'::jsonb),
('ORD-110', 'Oficinas Gamma', '555-0110', 'Torre Empresarial Piso 5', 'Alarma Intrusión', 'Sensores de movimiento', 'PROGRAMADO', now() - interval '2 days', true, true, 'T-007', CURRENT_DATE + interval '2 days', NULL, NULL, '[{"productId": "P-003", "quantity": 1, "name": "Panel de Alarma DSC Neo"}, {"productId": "P-002", "quantity": 5, "name": "Sensor de Movimiento PIR"}, {"productId": "P-006", "quantity": 1, "name": "Sirena Exterior 30W"}]'::jsonb),
('ORD-111', 'Restaurante El Chef', '555-0111', 'Calle Gastronomía 12', 'CCTV 4 Cámaras', 'Cocina y comedor', 'COMPLETADO', now() - interval '3 days', true, true, 'T-010', CURRENT_DATE - interval '1 day', NULL, NULL, '[{"productId": "P-001", "quantity": 4, "name": "Cámara IP 4K Hikvision"}, {"productId": "P-005", "quantity": 1, "name": "Disco Duro Púrpura 4TB"}]'::jsonb),
('ORD-112', 'Hotel Paraíso', '555-0112', 'Av. Turismo 300', 'Cerraduras Electrónicas', 'Para 20 habitaciones', 'FACTURADO', now() - interval '8 days', true, true, 'T-013', CURRENT_DATE - interval '3 days', NULL, NULL, '[{"productId": "P-014", "quantity": 20, "name": "Cerradura Electromagnética"}]'::jsonb),
('ORD-113', 'Farmacia Cruz', '555-0113', 'Esquina Salud y Vida', 'CCTV y Alarma', 'Combo seguridad', 'POSTVENTA_COMPLETADA', now() - interval '25 days', true, true, 'T-001', CURRENT_DATE - interval '20 days', 'Regular', 'Hubo demora en la instalación pero el sistema funciona bien.', '[{"productId": "P-001", "quantity": 4, "name": "Cámara IP 4K Hikvision"}, {"productId": "P-003", "quantity": 1, "name": "Panel de Alarma DSC Neo"}, {"productId": "P-002", "quantity": 2, "name": "Sensor de Movimiento PIR"}]'::jsonb),
('ORD-114', 'Fábrica de Muebles', '555-0114', 'Zona Industrial 50', 'CCTV 16 Cámaras', 'Exteriores e interiores', 'PENDIENTE', now(), true, false, NULL, NULL, NULL, NULL, '[{"productId": "P-001", "quantity": 16, "name": "Cámara IP 4K Hikvision"}, {"productId": "P-005", "quantity": 2, "name": "Disco Duro Púrpura 4TB"}]'::jsonb),
('ORD-115', 'Librería Central', '555-0115', 'Calle Lectura 9', 'Sensor Antihurto', 'Arcos en puerta', 'APROBADO', now() - interval '2 days', true, true, NULL, NULL, NULL, NULL, '[{"productId": "P-007", "quantity": 2, "name": "Contacto Magnético Puerta/Ventana"}]'::jsonb);
