-- ============================================================
-- SISTEMA DE GESTIÓN DE BARBERÍA - BASE DE DATOS COMPLETA
-- Autor: Andrés Felipe Mora
-- Licencia: CC BY-NC-SA 4.0
-- Zona horaria: America/Bogota
-- ============================================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS barberia_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE barberia_db;

-- ============================================================
-- TABLAS PRINCIPALES
-- ============================================================

-- Tabla de Administradores
CREATE TABLE IF NOT EXISTS administradores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de Empleados/Barberos
CREATE TABLE IF NOT EXISTS empleados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    cedula VARCHAR(20) UNIQUE NOT NULL,
    foto VARCHAR(255),
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de Servicios
CREATE TABLE IF NOT EXISTS servicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    duracion INT DEFAULT 60 COMMENT 'Duración en minutos (siempre 60)',
    precio DECIMAL(10, 2) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de Horarios de trabajo de empleados
CREATE TABLE IF NOT EXISTS horarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empleado_id INT NOT NULL,
    dia_semana ENUM('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo') NOT NULL,
    hora_inicio TIME DEFAULT '10:00:00',
    hora_fin TIME DEFAULT '18:00:00',
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE CASCADE,
    UNIQUE KEY unique_empleado_dia (empleado_id, dia_semana)
);

-- Tabla de Bloqueos (vacaciones, días libres)
CREATE TABLE IF NOT EXISTS bloqueos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empleado_id INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    motivo ENUM('vacaciones', 'dia_libre', 'otro') NOT NULL,
    descripcion TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE CASCADE
);

-- Tabla de Citas
CREATE TABLE IF NOT EXISTS citas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_nombre VARCHAR(100) NOT NULL,
    cliente_cedula VARCHAR(20) NOT NULL,
    cliente_email VARCHAR(100) NOT NULL,
    cliente_telefono VARCHAR(20) NOT NULL,
    servicio_id INT NOT NULL,
    empleado_id INT NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    estado ENUM('pendiente', 'confirmada', 'cancelada', 'completada') DEFAULT 'pendiente',
    recordatorio_enviado BOOLEAN DEFAULT FALSE,
    email_confirmacion_enviado BOOLEAN DEFAULT FALSE,
    email_recibo_enviado BOOLEAN DEFAULT FALSE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (servicio_id) REFERENCES servicios(id),
    FOREIGN KEY (empleado_id) REFERENCES empleados(id),
    UNIQUE KEY unique_cita (empleado_id, fecha, hora)
);

-- Tabla de días festivos
CREATE TABLE IF NOT EXISTS dias_festivos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE UNIQUE NOT NULL,
    descripcion VARCHAR(100) NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Ventas (registro de ingresos por cita completada)
CREATE TABLE IF NOT EXISTS ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cita_id INT NOT NULL,
    empleado_id INT NOT NULL,
    servicio_id INT NOT NULL,
    fecha DATE NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cita_id) REFERENCES citas(id) ON DELETE CASCADE,
    FOREIGN KEY (empleado_id) REFERENCES empleados(id),
    FOREIGN KEY (servicio_id) REFERENCES servicios(id),
    UNIQUE KEY unique_venta_cita (cita_id)
);

-- ============================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_citas_fecha ON citas(fecha);
CREATE INDEX IF NOT EXISTS idx_citas_estado ON citas(estado);
CREATE INDEX IF NOT EXISTS idx_citas_empleado ON citas(empleado_id);
CREATE INDEX IF NOT EXISTS idx_bloqueos_fechas ON bloqueos(fecha_inicio, fecha_fin);
CREATE INDEX IF NOT EXISTS idx_dias_festivos_fecha ON dias_festivos(fecha);
CREATE INDEX IF NOT EXISTS idx_ventas_fecha ON ventas(fecha);
CREATE INDEX IF NOT EXISTS idx_ventas_empleado ON ventas(empleado_id);

-- ============================================================
-- DATOS INICIALES
-- ============================================================

-- Administrador por defecto
-- Usuario: admin
-- Contraseña: admin123 (hasheado con bcrypt)
INSERT INTO administradores (usuario, password, nombre, email) VALUES 
('admin', '$2b$10$UuTvgUGo3c7gNOdrVNjPa.DiA0vB3b4Hxb4WN9ye6FCNS.lhy1ruG', 'Administrador Principal', 'admin@barberia.com')
ON DUPLICATE KEY UPDATE password = '$2b$10$UuTvgUGo3c7gNOdrVNjPa.DiA0vB3b4Hxb4WN9ye6FCNS.lhy1ruG';

-- Empleados de ejemplo
INSERT INTO empleados (nombre, cedula, foto) VALUES 
('Carlos Rodríguez', '1234567890', 'carlos.jpg'),
('Miguel Ángel Torres', '0987654321', 'miguel.jpg'),
('Juan Pablo Gómez', '1122334455', 'juan.jpg')
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

-- Servicios de ejemplo
INSERT INTO servicios (nombre, descripcion, precio) VALUES 
('Corte de Cabello', 'Corte de cabello clásico con máquina y tijera. Incluye shampoo y masaje capilar relajante', 25000.00),
('Corte + Barba', 'Corte de cabello más arreglo de barba completo. Incluye shampoo y masaje capilar relajante', 40000.00),
('Afeitado Clásico', 'Afeitado tradicional con navaja, vapor facial, toalla caliente y aceites esenciales para un acabado suave y refrescante', 30000.00),
('Corte Infantil', 'Corte de cabello para niños hasta 12 años. Incluye shampoo y masaje capilar relajante', 20000.00),
('Diseño de Barba', 'Diseño y perfilado de barba con técnicas profesionales', 25000.00)
ON DUPLICATE KEY UPDATE descripcion = VALUES(descripcion), precio = VALUES(precio);

-- Horarios de trabajo (Lunes a Sábado para todos los barberos)
INSERT INTO horarios (empleado_id, dia_semana, hora_inicio, hora_fin) VALUES 
-- Carlos
(1, 'lunes', '10:00:00', '18:00:00'),
(1, 'martes', '10:00:00', '18:00:00'),
(1, 'miercoles', '10:00:00', '18:00:00'),
(1, 'jueves', '10:00:00', '18:00:00'),
(1, 'viernes', '10:00:00', '18:00:00'),
(1, 'sabado', '10:00:00', '18:00:00'),
-- Miguel
(2, 'lunes', '10:00:00', '18:00:00'),
(2, 'martes', '10:00:00', '18:00:00'),
(2, 'miercoles', '10:00:00', '18:00:00'),
(2, 'jueves', '10:00:00', '18:00:00'),
(2, 'viernes', '10:00:00', '18:00:00'),
(2, 'sabado', '10:00:00', '18:00:00'),
-- Juan
(3, 'lunes', '10:00:00', '18:00:00'),
(3, 'martes', '10:00:00', '18:00:00'),
(3, 'miercoles', '10:00:00', '18:00:00'),
(3, 'jueves', '10:00:00', '18:00:00'),
(3, 'viernes', '10:00:00', '18:00:00'),
(3, 'sabado', '10:00:00', '18:00:00')
ON DUPLICATE KEY UPDATE hora_inicio = VALUES(hora_inicio), hora_fin = VALUES(hora_fin);

-- Días festivos de Colombia 2025
INSERT INTO dias_festivos (fecha, descripcion) VALUES 
('2025-01-01', 'Año Nuevo'),
('2025-01-06', 'Día de los Reyes Magos'),
('2025-03-24', 'Día de San José'),
('2025-04-17', 'Jueves Santo'),
('2025-04-18', 'Viernes Santo'),
('2025-05-01', 'Día del Trabajo'),
('2025-06-02', 'Ascensión del Señor'),
('2025-06-23', 'Corpus Christi'),
('2025-06-30', 'Sagrado Corazón'),
('2025-07-07', 'San Pedro y San Pablo'),
('2025-07-20', 'Día de la Independencia'),
('2025-08-07', 'Batalla de Boyacá'),
('2025-08-18', 'Asunción de la Virgen'),
('2025-10-13', 'Día de la Raza'),
('2025-11-03', 'Todos los Santos'),
('2025-11-17', 'Independencia de Cartagena'),
('2025-12-08', 'Inmaculada Concepción'),
('2025-12-25', 'Navidad')
ON DUPLICATE KEY UPDATE descripcion = VALUES(descripcion);

-- ============================================================
-- VERIFICACIÓN DE INSTALACIÓN
-- ============================================================

SELECT 'Base de datos creada exitosamente' AS mensaje;
SELECT COUNT(*) AS total_administradores FROM administradores;
SELECT COUNT(*) AS total_empleados FROM empleados;
SELECT COUNT(*) AS total_servicios FROM servicios;
SELECT COUNT(*) AS total_horarios FROM horarios;
SELECT COUNT(*) AS total_dias_festivos FROM dias_festivos;

-- ============================================================
-- INSTRUCCIONES DE USO
-- ============================================================
-- 1. Ejecutar este script completo en MySQL
-- 2. Usuario administrador por defecto:
--    Usuario: admin
--    Contraseña: admin123
-- 3. Configurar .env en el backend con las credenciales de MySQL
-- 4. Iniciar el servidor backend: npm start
-- 5. Iniciar el frontend: npm run dev
-- ============================================================
