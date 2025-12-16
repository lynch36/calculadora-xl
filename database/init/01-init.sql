-- Usuarios y roles
CREATE TABLE rol (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE usuario_rol (
    usuario_id INTEGER REFERENCES usuario(id) ON DELETE CASCADE,
    rol_id INTEGER REFERENCES rol(id) ON DELETE CASCADE,
    PRIMARY KEY (usuario_id, rol_id)
);

-- Sesiones
CREATE TABLE sesion (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuario(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expira_en TIMESTAMP
);

-- Clientes
CREATE TABLE cliente (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    telefono VARCHAR(20),
    direccion TEXT
);

-- Productos
CREATE TABLE producto (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio NUMERIC(12,2) NOT NULL,
    categoria VARCHAR(50),
    activo BOOLEAN DEFAULT TRUE
);

-- Cotizaciones
CREATE TABLE cotizacion (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER REFERENCES cliente(id) ON DELETE SET NULL,
    usuario_id INTEGER REFERENCES usuario(id) ON DELETE SET NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total NUMERIC(12,2) NOT NULL,
    estado VARCHAR(30) DEFAULT 'pendiente'
);

CREATE TABLE cotizacion_producto (
    cotizacion_id INTEGER REFERENCES cotizacion(id) ON DELETE CASCADE,
    producto_id INTEGER REFERENCES producto(id) ON DELETE CASCADE,
    cantidad INTEGER NOT NULL DEFAULT 1,
    precio_unitario NUMERIC(12,2) NOT NULL,
    PRIMARY KEY (cotizacion_id, producto_id)
);

-- Ventas
CREATE TABLE venta (
    id SERIAL PRIMARY KEY,
    cotizacion_id INTEGER REFERENCES cotizacion(id) ON DELETE SET NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total NUMERIC(12,2) NOT NULL
);

CREATE TABLE venta_producto (
    venta_id INTEGER REFERENCES venta(id) ON DELETE CASCADE,
    producto_id INTEGER REFERENCES producto(id) ON DELETE CASCADE,
    cantidad INTEGER NOT NULL DEFAULT 1,
    precio_unitario NUMERIC(12,2) NOT NULL,
    PRIMARY KEY (venta_id, producto_id)
);

-- Índices y restricciones adicionales
CREATE INDEX idx_usuario_email ON usuario(email);
CREATE INDEX idx_cliente_email ON cliente(email);
CREATE INDEX idx_producto_nombre ON producto(nombre);
CREATE INDEX idx_cotizacion_cliente ON cotizacion(cliente_id);

/* Pasos en pgAdmin:
Haz clic en Add New Server.
General → Name:
calculadora_postgres
Connection:
Host name/address: calculadora_postgres
Port: 5432
Username: calculadora_user
Password: calculadora_pass_456
(Marca "Save Password" si quieres)
Haz clic en Save. */