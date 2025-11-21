## 📋 Roadmap de Desarrollo - Calculadora XL

### 🎯 **Objetivo General**
Migrar de scripts manuales a automatización robusta y agregar funcionalidades de base de datos.

---

## 🚀 **FASE 1: Automatización con Playwright (SEMANA ACTUAL)**

### **Estado Actual**
- ✅ Aplicación funcional en JavaScript vanilla
- ✅ Scripts manuales (`dev-scripts.js`) para testing
- ✅ Problemas de actualización DOM
- ✅ Dependencia de refrescar manualmente

### **Objetivos de la Fase 1**
- Migrar de `dev-scripts.js` a Playwright
- Automatización robusta sin problemas de DOM
- Tests verificables automáticamente

### **Tareas - Semana 1**

#### **Día 1: Setup Inicial**
```bash
# Instalación Playwright
cd calculadora-xl
npm init -y
npm init playwright@latest
```

#### **Día 2-3: Primer Test**
```javascript
// tests/ejemplo.spec.js
const { test, expect } = require('@playwright/test');

test('Mi primera automatización', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.click('text=Limpiar Todo');
  await page.click('text=Mostrar Formulario');
  
  await page.selectOption('#categoriaProducto', 'cajas');
  await page.selectOption('#tipoProducto', '1');
  await page.fill('#base', '120');
  await page.fill('#altura', '240');
  await page.click('text=Agregar Producto');
  
  await expect(page.locator('#listaProductos')).toContainText('Caja');
});
```

#### **Día 4-5: Migrar Funciones Principales**
- `DevScripts.recrearCotizacionIO2025()` → `test('Cotización IO 2025')`
- `DevScripts.limpiarTodo()` → Helper functions
- `DevScripts.agregarProducto()` → Reusable functions

#### **Día 6-7: Helpers y Cleanup**
```javascript
// tests/helpers/cotizacion.js
class CotizacionHelper {
  async crearCotizacion(page, config) {
    // Lógica reutilizable
  }
}
```

### **Estructura Final Fase 1**
```
calculadora-xl/
├── tests/
│   ├── cotizaciones.spec.js
│   ├── productos.spec.js
│   └── helpers/
│       ├── productos.js
│       └── cotizaciones.js
├── playwright.config.js
├── js/
│   ├── app.js
│   └── dev-scripts.js (DEPRECATED)
└── package.json
```

### **Métricas de Éxito Fase 1**
- ✅ 0% dependencia de `dev-scripts.js`
- ✅ 100% tests pasan automáticamente
- ✅ 0% necesidad de refrescar manual
- ✅ Tiempo de testing reducido 70%

---

## 🗄️ **FASE 2: Integración Base de Datos (SEMANA 2-4)**

### **Objetivos de la Fase 2**
- Persistencia de datos (cotizaciones, productos, clientes)
- Historial de cotizaciones
- Templates de productos
- Backup automático

### **Tecnologías a Implementar**
- **Base de datos:** PostgreSQL 15
- **Cache:** Redis 7
- **ORM:** Prisma o Sequelize
- **Containerización:** Docker (solo para BD)

### **Tareas - Semana 2**

#### **Setup Docker para BD**
```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: calculadora
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

#### **Esquema de Base de Datos**
```sql
-- database/schema.sql
CREATE TABLE clientes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  empresa VARCHAR(255),
  email VARCHAR(255),
  telefono VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE cotizaciones (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER REFERENCES clientes(id),
  fecha DATE DEFAULT CURRENT_DATE,
  total DECIMAL(10,2),
  estado VARCHAR(50) DEFAULT 'borrador',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE productos (
  id SERIAL PRIMARY KEY,
  cotizacion_id INTEGER REFERENCES cotizaciones(id),
  categoria VARCHAR(100) NOT NULL,
  tipo VARCHAR(100) NOT NULL,
  medidas JSONB,
  precio DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **Tareas - Semana 3**
- Integrar ORM con aplicación existente
- Migrar lógica de productos a BD
- Crear API endpoints básicos

### **Tareas - Semana 4**
- Actualizar tests de Playwright para usar BD
- Implementar seeding de datos de test
- Crear helpers de BD para testing

### **Estructura Final Fase 2**
```
calculadora-xl/
├── tests/ (usando BD Docker)
├── database/
│   ├── schema.sql
│   ├── seeds.sql
│   └── migrations/
├── api/
│   ├── clientes.js
│   ├── cotizaciones.js
│   └── productos.js
├── docker-compose.yml
└── js/app.js (integrado con BD)
```

---

## 🔧 **FASE 3: Funcionalidades Avanzadas (SEMANA 5-8)**

### **Objetivos de la Fase 3**
- Dashboard de cotizaciones
- Reportes y analytics
- Templates de productos
- Export/Import avanzado

### **Nuevas Funcionalidades**
- **Dashboard:** Resumen de cotizaciones por período
- **Templates:** Productos predefinidos guardados
- **Historial:** Tracking de cambios en cotizaciones
- **Analytics:** Productos más vendidos, clientes frecuentes
- **Export:** PDF mejorado, Excel, CSV
- **API REST:** Para integraciones futuras

### **Estructura Final Fase 3**
```
calculadora-xl/
├── tests/
│   ├── integration/
│   ├── e2e/
│   └── api/
├── frontend/
│   ├── dashboard/
│   ├── templates/
│   └── reports/
├── backend/
│   ├── api/
│   ├── services/
│   └── models/
├── database/
└── docker-compose.yml
```

---

## 🚢 **FASE 4: Producción y CI/CD (SEMANA 9-12)**

### **Objetivos de la Fase 4**
- Containerización completa
- CI/CD automático
- Monitoreo y logs
- Deployment automático

### **Tecnologías Fase 4**
- **Containerización:** Docker completo
- **CI/CD:** GitHub Actions
- **Deployment:** Railway, Vercel, o VPS
- **Monitoreo:** Logs estructurados

### **Pipeline de CI/CD**
```yaml
# .github/workflows/test-deploy.yml
name: Test and Deploy
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npx playwright install
      - run: npm test
      - run: npx playwright test

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: # Deploy logic
```

---

## 📊 **Métricas y Timeline**

### **Timeline General**
- **Semana 1:** Playwright setup y migración básica
- **Semana 2-4:** Base de datos e integración
- **Semana 5-8:** Funcionalidades avanzadas
- **Semana 9-12:** Producción y CI/CD

### **Métricas de Progreso**
| Fase | Automatización | Performance | Mantenibilidad | Escalabilidad |
|------|----------------|-------------|----------------|---------------|
| Actual | 20% | 60% | 30% | 10% |
| Fase 1 | 80% | 80% | 70% | 30% |
| Fase 2 | 85% | 75% | 80% | 60% |
| Fase 3 | 90% | 85% | 85% | 80% |
| Fase 4 | 95% | 90% | 90% | 95% |

---

## ⚠️ **Consideraciones y Riesgos**

### **Riesgos Identificados**
- **Tiempo de aprendizaje:** Playwright + PostgreSQL + Docker
- **Complejidad:** De aplicación simple a full-stack
- **Breaking changes:** Migración puede romper funcionalidad existente

### **Mitigaciones**
- **Desarrollo incremental:** No cambiar todo de una vez
- **Testing continuo:** Playwright valida que no se rompa nada
- **Rollback plan:** Mantener versión actual funcionando

### **Decisiones Tecnológicas**
- ✅ **Playwright nativo primero** (no Docker desde día 1)
- ✅ **PostgreSQL** para datos relacionales
- ✅ **Docker para BD** desde fase 2
- ✅ **Full Docker** solo para producción

---

## 🎯 **Próximos Pasos Inmediatos**

### **Esta Semana**
```bash
# 1. Instalar Playwright (HOY)
npm init playwright@latest

# 2. Crear primer test (MAÑANA)
# 3. Migrar DevScripts.recrearCotizacionIO2025() (ESTA SEMANA)
```

### **Semana Siguiente**
- Evaluar necesidades específicas de BD
- Diseñar esquema de datos
- Setup Docker para desarrollo BD

---

## 📋 **Log de Progreso**

### **18 de Noviembre 2025**
- ✅ Identificación de problemas con `dev-scripts.js`
- ✅ Definición de roadmap completo
- ✅ Análisis de precios reales y fórmula de cotización
- 🟡 **EN CURSO:** Setup inicial de Playwright
- ⏳ **PRÓXIMO:** Creación del primer test automatizado

### **Pendientes ACTUALIZADOS**
- [ ] Instalación y configuración de Playwright (EN CURSO)
- [ ] Migración del primer test desde DevScripts
- [ ] Creación de helpers reutilizables
- [ ] Evaluación de esquema de base de datos

---

## 📋 **Backlog de Desarrollo (Noviembre 2025)**

### **🔧 CORREGIR (Alta prioridad - Bugs activos)**

| Prioridad | Issue | Descripción | Tiempo Est. | Estado | Deadline |
|-----------|-------|-------------|-------------|--------|-----------|
| 🔴 **1** | Editor no agrega productos | Bug crítico: botón agregar en modo edición no funciona | 2-3 horas | 🔴 **URGENTE** | 19 Nov 2025 |
| 🟡 **2** | Reset timing formulario | Reset se ejecuta tarde, no después del prompt confirm | 30 min | 📋 Pendiente | 20 Nov 2025 |
| 🟠 **3** | Redundancia neón rendering | Triple rendering: "Categoría" → "Tipo" → "Tipo Neón" | 1-2 horas | 📋 Pendiente | 25 Nov 2025 |

### **🔗 INTEGRACIÓN (Mediana prioridad - Nuevas features)**

| Feature | Descripción | Complejidad | Estado |
|---------|-------------|-------------|--------|
| **Process Manager** | Tracking: Cotización → Venta → Producción → Instalación | 🟡 Media | 💭 Diseño |
| **IA Letras 3D** | Cotización automática desde plano/imagen | 🔴 Alta | 🔍 Research |

### **📝 TAREAS DE DOCUMENTACIÓN**

- [✅] Actualizar secciones completadas del roadmap
- [ ] Documentar bugs identificados y soluciones
- [ ] Planificar integración de IA para análisis 3D

---

## 🎯 **Sprint Actual (18-25 Nov 2025)**

### **Objetivos de la semana (18-25 Nov):**
1. 🟡 **Setup Playwright completo** (configuración básica)
2. 🔴 **Fix URGENTE:** Editor no agrega productos (2-3 horas)
3. 🟡 **Crear primer test** migrado desde DevScripts
4. 🟠 **Fix menor:** Reset timing formulario (30 min)

### **Tareas técnicas específicas:**
```bash
# Debug Editor Issue
1. Investigar event listeners en form-manager.js
2. Verificar selector de botón "agregarProductoEdicion"
3. Crear test Playwright para reproducir bug
4. Implementar fix y validar

# Fix Reset Timing
1. Mover this.resetearFormulario() después de confirm
2. Validar que no rompe funcionalidad existente
3. Test de regresión
```

### **Métricas objetivo semana (REALISTAS):**
- 🐛 **1 bug crítico resuelto** (Editor no agrega productos)
- 🎯 **Setup Playwright completado** (configuración + primer test)
- 📋 **Documentación actualizada** (roadmap + proceso de debugging)
- 🚀 **Base sólida para Fase 2** (tests funcionando)

---

## 🔮 **Roadmap de Integraciones Futuras**

### **Phase 2.5: Process Management (Dic 2025)**
```sql
-- Estructura BD planificada
CREATE TABLE ventas (
    cotizacion_id INTEGER,
    estado VARCHAR(50), -- vendido, produccion, listo, instalado
    fecha_venta DATE,
    instalador VARCHAR(100)
);

CREATE TABLE procesos (
    venta_id INTEGER,
    fase VARCHAR(50), -- diseño, corte, ensamble, acabado
    estado VARCHAR(50),
    fecha_fin_estimada DATE
);
```

### **Phase 3.5: IA Integration (Ene 2026)**
```javascript
// Sistema de cotización automática desde planos
class AnalizadorPlanosLetras3D {
    static async cotizarDesdeePlano(archivoPlano) {
        const analisis = await this.analizarPlano(archivoPlano);
        const cotizacion = this.calcularPrecioTotal(analisis);
        
        return {
            altura_cm: analisis.altura_cm,
            cantidad_piezas: analisis.cantidadPiezas,
            tipo_letra: analisis.tipoLetra,
            precio_total: cotizacion.precioTotal
        };
    }
    
    static calcularPrecioTotal(analisis) {
        // FÓRMULA: (Altura × Cantidad_piezas) × Costo_tipo
        const { altura_cm, cantidadPiezas, tipoLetra } = analisis;
        
        // Tarifas base por tipo de letra (PRECIOS REALES)
        const tarifasPorTipo = {
            '3d_acrilico_luz': 35,    // Acrílico con luz
            '3d_aluminio_luz': 25,    // Aluminio con luz  
            '3d_acrilico_sin': 30,    // Acrílico sin luz
            '3d_aluminio_sin': 20,    // Aluminio sin luz
            'planas_acrilico': 18,    // Letras planas acrílico
            'planas_aluminio': 12     // Letras planas aluminio
        };
        
        const precioBase = tarifasPorTipo[tipoLetra];
        const precioTotal = (altura_cm * cantidadPiezas) * precioBase;
        
        return {
            precioTotal: precioTotal
        };
    }
    
    static async analizarPlano(archivo) {
        // Análisis automático del plano
        const vision = await openai.vision.analyze(archivo);
        
        return {
            altura_cm: this.extraerAltura(vision),
            cantidadPiezas: this.contarPiezas(vision),
            tipoLetra: this.detectarTipoLetra(vision)
        };
    }
    
    static extraerAltura(visionData) {
        // OCR para detectar altura como "40cm"
        const dimensionRegex = /(\d+(?:\.\d+)?)\s*cm/g;
        const medidas = [...visionData.text.matchAll(dimensionRegex)]
            .map(match => parseFloat(match[1]));
        
        // Retorna la medida más pequeña > 10 (altura típica)
        return Math.min(...medidas.filter(m => m > 10)) || 40;
    }
    
    static contarPiezas(visionData) {
        // Detectar cantidad de letras/números en el plano
        const caracteres = visionData.text.replace(/[^A-Za-z0-9]/g, '');
        return caracteres.length || 1;
    }
    
    static detectarTipoLetra(visionData) {
        // Por ahora retorna tipo por defecto, después se puede mejorar
        return '3d_acrilico_luz';
    }
}

// Ejemplo de uso con plano 600cm x 40cm:
// Letras 3D Acrílico con luz: (40cm × 10_piezas) × $35 = $14,000
// Letras planas Acrílico: (40cm × 10_piezas) × $18 = $7,200
```

**APIs consideradas:**
- OpenAI Vision API (análisis de planos y OCR)
- Google Vision API (detección de texto y medidas)
- Custom ML model (conteo de piezas específico)
- TensorFlow.js (procesamiento local de imágenes)

---

## 📋 **Estructura de Base de Datos**

### **Sistema de Gestión de Ventas (50% inicial + liquidación)**

```sql
-- 💼 CLIENTES Y COTIZACIONES
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    telefono VARCHAR(50),
    email VARCHAR(100),
    direccion TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE cotizaciones (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER REFERENCES clientes(id),
    numero_cotizacion VARCHAR(50) UNIQUE NOT NULL,
    total_bruto DECIMAL(12,2) NOT NULL,
    descuento DECIMAL(5,2) DEFAULT 0,
    total_neto DECIMAL(12,2) NOT NULL,
    estado VARCHAR(30) DEFAULT 'cotizada', -- cotizada, vendida, anulada
    fecha_cotizacion TIMESTAMP DEFAULT NOW(),
    fecha_vencimiento DATE,
    observaciones TEXT
);

-- 📦 PRODUCTOS Y SERVICIOS
CREATE TABLE productos_cotizacion (
    id SERIAL PRIMARY KEY,
    cotizacion_id INTEGER REFERENCES cotizaciones(id),
    categoria VARCHAR(100) NOT NULL, -- cajas, neon, letras3d, servicios
    tipo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    medidas JSONB, -- {base: 120, altura: 240, profundidad: 30}
    precio_unitario DECIMAL(10,2),
    cantidad INTEGER DEFAULT 1,
    subtotal DECIMAL(12,2)
);

-- 💰 SISTEMA DE VENTAS (50% + LIQUIDACIÓN)
CREATE TABLE ventas (
    id SERIAL PRIMARY KEY,
    cotizacion_id INTEGER REFERENCES cotizaciones(id),
    numero_venta VARCHAR(50) UNIQUE NOT NULL,
    total_venta DECIMAL(12,2) NOT NULL,
    anticipo_50 DECIMAL(12,2) NOT NULL, -- 50% inicial
    saldo_pendiente DECIMAL(12,2) NOT NULL, -- 50% restante
    fecha_venta TIMESTAMP DEFAULT NOW(),
    estado_pago VARCHAR(30) DEFAULT 'anticipo_pagado', -- anticipo_pagado, liquidado
    metodo_pago_anticipo VARCHAR(50), -- efectivo, transferencia, tarjeta
    metodo_pago_liquidacion VARCHAR(50)
);

-- 🏭 PROCESO DE FABRICACIÓN
CREATE TABLE procesos_fabricacion (
    id SERIAL PRIMARY KEY,
    venta_id INTEGER REFERENCES ventas(id),
    fase VARCHAR(50) NOT NULL, -- diseño, corte, ensamble, acabado, listo
    responsable VARCHAR(100),
    fecha_inicio TIMESTAMP,
    fecha_fin_estimada TIMESTAMP,
    fecha_fin_real TIMESTAMP,
    estado VARCHAR(30) DEFAULT 'pendiente', -- pendiente, en_proceso, completado
    observaciones TEXT
);

-- 🚚 INSTALACIÓN Y ENTREGA
CREATE TABLE instalaciones (
    id SERIAL PRIMARY KEY,
    venta_id INTEGER REFERENCES ventas(id),
    instalador VARCHAR(100),
    fecha_programada DATE,
    fecha_realizada TIMESTAMP,
    direccion_instalacion TEXT,
    estado VARCHAR(30) DEFAULT 'programada', -- programada, completada, cancelada
    tiempo_instalacion INTEGER, -- minutos
    observaciones_instalacion TEXT
);

-- 💸 LIQUIDACIÓN DE VENTAS
CREATE TABLE liquidaciones (
    id SERIAL PRIMARY KEY,
    venta_id INTEGER REFERENCES ventas(id),
    monto_liquidado DECIMAL(12,2) NOT NULL,
    fecha_liquidacion TIMESTAMP DEFAULT NOW(),
    metodo_pago VARCHAR(50),
    referencia_pago VARCHAR(100), -- número de transferencia, etc.
    liquidado_por VARCHAR(100), -- quien recibió el pago
    observaciones TEXT
);

-- 📊 MÉTRICAS Y TRACKING
CREATE TABLE metricas_proyecto (
    id SERIAL PRIMARY KEY,
    venta_id INTEGER REFERENCES ventas(id),
    tiempo_diseño INTEGER, -- minutos
    tiempo_fabricacion INTEGER, -- minutos
    tiempo_instalacion INTEGER, -- minutos
    costo_materiales DECIMAL(10,2),
    rentabilidad DECIMAL(5,2), -- porcentaje
    satisfaccion_cliente INTEGER CHECK (satisfaccion_cliente BETWEEN 1 AND 5),
    fecha_registro TIMESTAMP DEFAULT NOW()
);
```

### **📈 Vistas de Negocio**

```sql
-- Vista: Ventas pendientes de liquidación
CREATE VIEW ventas_pendientes_liquidacion AS
SELECT 
    v.id, v.numero_venta, c.nombre as cliente,
    v.total_venta, v.anticipo_50, v.saldo_pendiente,
    EXTRACT(DAYS FROM (NOW() - v.fecha_venta)) as dias_venta,
    i.estado as estado_instalacion
FROM ventas v
JOIN cotizaciones cot ON v.cotizacion_id = cot.id
JOIN clientes c ON cot.cliente_id = c.id
LEFT JOIN instalaciones i ON v.id = i.venta_id
WHERE v.estado_pago = 'anticipo_pagado'
AND NOT EXISTS (
    SELECT 1 FROM liquidaciones l WHERE l.venta_id = v.id
);

-- Vista: Rentabilidad por proyecto
CREATE VIEW rentabilidad_proyectos AS
SELECT 
    v.numero_venta,
    v.total_venta,
    m.costo_materiales,
    (v.total_venta - m.costo_materiales) as utilidad_bruta,
    m.rentabilidad,
    (m.tiempo_diseño + m.tiempo_fabricacion + m.tiempo_instalacion) as tiempo_total_horas
FROM ventas v
JOIN metricas_proyecto m ON v.id = m.venta_id;

-- Vista: Pipeline de producción
CREATE VIEW pipeline_produccion AS
SELECT 
    v.numero_venta,
    c.nombre as cliente,
    pf.fase,
    pf.estado,
    pf.fecha_fin_estimada,
    CASE 
        WHEN pf.fecha_fin_estimada < NOW() AND pf.estado != 'completado' THEN 'RETRASADO'
        ELSE 'EN_TIEMPO'
    END as alerta
FROM ventas v
JOIN cotizaciones cot ON v.cotizacion_id = cot.id
JOIN clientes c ON cot.cliente_id = c.id
JOIN procesos_fabricacion pf ON v.id = pf.venta_id
WHERE pf.estado IN ('pendiente', 'en_proceso');
```

### **🔧 Funciones de Negocio**

```sql
-- Función: Liquidar venta automáticamente
CREATE OR REPLACE FUNCTION liquidar_venta(
    p_venta_id INTEGER,
    p_metodo_pago VARCHAR(50),
    p_referencia VARCHAR(100),
    p_liquidado_por VARCHAR(100)
) RETURNS BOOLEAN AS $$
DECLARE
    v_saldo DECIMAL(12,2);
BEGIN
    -- Obtener saldo pendiente
    SELECT saldo_pendiente INTO v_saldo
    FROM ventas WHERE id = p_venta_id;
    
    -- Insertar liquidación
    INSERT INTO liquidaciones (venta_id, monto_liquidado, metodo_pago, referencia_pago, liquidado_por)
    VALUES (p_venta_id, v_saldo, p_metodo_pago, p_referencia, p_liquidado_por);
    
    -- Actualizar estado de venta
    UPDATE ventas 
    SET estado_pago = 'liquidado',
        metodo_pago_liquidacion = p_metodo_pago
    WHERE id = p_venta_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Calcular rentabilidad automática
CREATE OR REPLACE FUNCTION calcular_rentabilidad()
RETURNS TRIGGER AS $$
BEGIN
    NEW.rentabilidad = ((NEW.total_venta - NEW.costo_materiales) / NEW.total_venta) * 100;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_rentabilidad
    BEFORE INSERT OR UPDATE ON metricas_proyecto
    FOR EACH ROW EXECUTE FUNCTION calcular_rentabilidad();
```

### **📊 Queries de Dashboard**

```sql
-- Ventas del mes actual
SELECT COUNT(*) as ventas_mes, SUM(total_venta) as ingresos_mes
FROM ventas 
WHERE EXTRACT(MONTH FROM fecha_venta) = EXTRACT(MONTH FROM NOW())
AND EXTRACT(YEAR FROM fecha_venta) = EXTRACT(YEAR FROM NOW());

-- Proyectos en fabricación
SELECT COUNT(*) as proyectos_fabricacion
FROM procesos_fabricacion
WHERE estado IN ('pendiente', 'en_proceso');

-- Liquidaciones pendientes
SELECT SUM(saldo_pendiente) as monto_por_cobrar
FROM ventas_pendientes_liquidacion;

-- Top 5 clientes por volumen
SELECT c.nombre, COUNT(v.id) as num_ventas, SUM(v.total_venta) as volumen_total
FROM clientes c
JOIN cotizaciones cot ON c.id = cot.cliente_id
JOIN ventas v ON cot.id = v.cotizacion_id
GROUP BY c.id, c.nombre
ORDER BY volumen_total DESC
LIMIT 5;
```

### **📄 Estructura para Cotizaciones MD → DB**

#### **Migración de archivos `cotizacion_*.md` a PostgreSQL:**

```sql
-- 📝 COTIZACIONES DESDE ARCHIVOS MD
CREATE TABLE cotizaciones_md (
    id SERIAL PRIMARY KEY,
    archivo_origen VARCHAR(255) NOT NULL, -- cotizacion_Dra._Angelica_2025-11-03.md
    numero_cotizacion VARCHAR(50) UNIQUE, -- auto-generado o extraído del filename
    
    -- INFORMACIÓN GENERAL (extraída del MD)
    fecha_cotizacion DATE NOT NULL,
    cliente_nombre VARCHAR(200) NOT NULL,
    cliente_contacto JSONB, -- teléfono, email si están en el MD
    
    -- TOTALES (calculados desde productos)
    total_bruto DECIMAL(12,2) NOT NULL,
    descuento DECIMAL(5,2) DEFAULT 0,
    total_neto DECIMAL(12,2) NOT NULL,
    
    -- CONDICIONES COMERCIALES
    metodos_pago TEXT[], -- ["Transferencia bancaria", "Efectivo en sucursal"]
    anticipo_porcentaje INTEGER DEFAULT 50,
    tiempo_entrega VARCHAR(100), -- "De 10 a 15 días hábiles"
    vigencia_dias INTEGER DEFAULT 10,
    
    -- METADATA
    contenido_md_original TEXT, -- backup del contenido completo
    procesado_at TIMESTAMP DEFAULT NOW(),
    estado VARCHAR(30) DEFAULT 'importada' -- importada, enviada, aceptada, rechazada
);

-- 🎯 PRODUCTOS DESDE MD (parseados automáticamente)
CREATE TABLE productos_cotizacion_md (
    id SERIAL PRIMARY KEY,
    cotizacion_md_id INTEGER REFERENCES cotizaciones_md(id) ON DELETE CASCADE,
    orden_en_cotizacion INTEGER, -- 1, 2, 3... según orden en el MD
    
    -- PRODUCTO PARSEADO
    tipo_producto VARCHAR(100), -- "Letras 3D Acrílico con luz"
    descripcion_completa TEXT, -- "Dental Studio - 120cm x 65.16cm"
    texto_letras VARCHAR(200), -- "Dental Studio" | "5547329054"
    
    -- DIMENSIONES (extraídas automáticamente)
    ancho_cm DECIMAL(8,2), -- 120 | 330
    alto_cm DECIMAL(8,2), -- 65.16 | 40
    profundidad_cm DECIMAL(8,2), -- si está especificada
    
    -- PRICING
    precio_unitario DECIMAL(10,2) NOT NULL,
    cantidad INTEGER DEFAULT 1,
    subtotal DECIMAL(12,2) NOT NULL,
    
    -- ESPECIFICACIONES TÉCNICAS
    material VARCHAR(100), -- "Acrílico"
    iluminacion BOOLEAN DEFAULT false, -- "con luz" = true
    color VARCHAR(50), -- si está especificado
    acabado VARCHAR(50) -- si está especificado
);

-- 📊 ANÁLISIS AUTOMÁTICO DE PLANOS
CREATE TABLE analisis_planos (
    id SERIAL PRIMARY KEY,
    cotizacion_md_id INTEGER REFERENCES cotizaciones_md(id),
    archivo_plano VARCHAR(255), -- imagen/PDF del plano
    
    -- DIMENSIONES DETECTADAS (OCR automático)
    ancho_total_cm DECIMAL(8,2), -- 600cm del ejemplo
    altura_total_cm DECIMAL(8,2), -- 40cm del ejemplo
    
    -- ANÁLISIS DE CONTENIDO
    texto_detectado TEXT, -- OCR del texto en las letras
    cantidad_piezas INTEGER, -- número de letras/elementos
    tipo_letra VARCHAR(30), -- '3d' o 'planas'
    
    -- CÁLCULO AUTOMÁTICO (Altura × Cantidad × Costo_tipo)
    altura_calculo_cm DECIMAL(8,2), -- altura usada en fórmula
    precio_por_unidad DECIMAL(8,2), -- altura × costo_base
    precio_total_calculado DECIMAL(10,2),
    
    -- METADATA DE PROCESAMIENTO
    confianza_ocr DECIMAL(3,2), -- 0.00-1.00
    tiempo_procesamiento_ms INTEGER,
    procesado_at TIMESTAMP DEFAULT NOW()
);

-- 💰 CATÁLOGO DE PRECIOS DINÁMICO
CREATE TABLE catalogo_precios (
    id SERIAL PRIMARY KEY,
    tipo_letra VARCHAR(30), -- '3d_acrilico_luz', 'planas_acrilico', etc.
    costo_base_por_cm DECIMAL(8,2), -- $35 3D Acrílico, $18 planas Acrílico, etc.
    vigente_desde DATE DEFAULT CURRENT_DATE,
    vigente_hasta DATE,
    activo BOOLEAN DEFAULT true
);

-- DATOS INICIALES DEL CATÁLOGO (PRECIOS REALES)
INSERT INTO catalogo_precios (tipo_letra, costo_base_por_cm) VALUES
('3d_acrilico_luz', 35.00),    -- Letras 3D Acrílico con luz
('3d_aluminio_luz', 25.00),    -- Letras 3D Aluminio con luz
('3d_acrilico_sin', 30.00),    -- Letras 3D Acrílico sin luz
('3d_aluminio_sin', 20.00),    -- Letras 3D Aluminio sin luz
('planas_acrilico', 18.00),    -- Letras planas Acrílico
('planas_aluminio', 12.00);    -- Letras planas Aluminio

-- 🎯 FUNCIÓN DE CÁLCULO AUTOMÁTICO
CREATE OR REPLACE FUNCTION calcular_precio_desde_plano(
    p_altura_cm DECIMAL(8,2),
    p_cantidad_piezas INTEGER,
    p_tipo_letra VARCHAR(30)
) RETURNS TABLE(
    precio_total DECIMAL(10,2),
    precio_unitario DECIMAL(8,2),
    desglose JSONB
) AS $$
DECLARE
    v_costo_base DECIMAL(8,2);
    v_precio_unitario DECIMAL(8,2);
    v_precio_total DECIMAL(10,2);
BEGIN
    -- Obtener precios actuales del catálogo
    SELECT costo_base_por_cm 
    INTO v_costo_base
    FROM catalogo_precios 
    WHERE tipo_letra = p_tipo_letra 
      AND activo = true
    LIMIT 1;
    
    -- FÓRMULA: (Altura × Cantidad) × Costo_base
    v_precio_unitario := p_altura_cm * v_costo_base;
    v_precio_total := v_precio_unitario * p_cantidad_piezas;
    
    RETURN QUERY SELECT 
        v_precio_total,
        v_precio_unitario,
        jsonb_build_object(
            'altura_cm', p_altura_cm,
            'cantidad_piezas', p_cantidad_piezas,
            'costo_base_por_cm', v_costo_base,
            'precio_por_unidad', v_precio_unitario,
            'total_calculado', v_precio_total
        );
END;
$$ LANGUAGE plpgsql;

-- 📈 VISTA: Análisis de rentabilidad por tipo
CREATE VIEW rentabilidad_por_tipo AS
SELECT 
    ap.tipo_letra,
    COUNT(*) as proyectos_procesados,
    AVG(ap.altura_calculo_cm) as altura_promedio,
    AVG(ap.cantidad_piezas) as piezas_promedio,
    AVG(ap.precio_total_calculado) as precio_promedio,
    SUM(ap.precio_total_calculado) as volumen_total
FROM analisis_planos ap
WHERE ap.procesado_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY ap.tipo_letra
ORDER BY volumen_total DESC;
```

#### **🔄 Función de Importación Automática**

```sql
-- Función para parsear cotización MD e insertarla en BD
CREATE OR REPLACE FUNCTION importar_cotizacion_md(
    p_archivo VARCHAR(255),
    p_contenido_md TEXT
) RETURNS INTEGER AS $$
DECLARE
    v_cotizacion_id INTEGER;
    v_fecha DATE;
    v_cliente VARCHAR(200);
    v_total DECIMAL(12,2);
BEGIN
    -- Extraer información básica del contenido MD
    v_fecha := (regexp_match(p_contenido_md, '\*\*Fecha:\*\* (\d{1,2}/\d{1,2}/\d{4})'))[1]::DATE;
    v_cliente := (regexp_match(p_contenido_md, '\*\*Cliente:\*\* (.+)'))[1];
    v_total := (regexp_match(p_contenido_md, '\*\*Total:\*\* \$([0-9,]+\.\d{2})'))[1]::DECIMAL;
    
    -- Insertar cotización principal
    INSERT INTO cotizaciones_md (
        archivo_origen, numero_cotizacion, fecha_cotizacion, 
        cliente_nombre, total_bruto, total_neto, contenido_md_original
    ) VALUES (
        p_archivo,
        'COT-' || TO_CHAR(v_fecha, 'YYYYMMDD') || '-' || UPPER(LEFT(v_cliente, 3)),
        v_fecha,
        v_cliente,
        v_total,
        v_total,
        p_contenido_md
    ) RETURNING id INTO v_cotizacion_id;
    
    -- TODO: Parsear productos automáticamente
    -- TODO: Extraer condiciones y garantías
    
    RETURN v_cotizacion_id;
END;
$$ LANGUAGE plpgsql;
```

#### **📊 Vistas para Dashboard de Cotizaciones MD**

```sql
-- Vista: Resumen de cotizaciones por cliente
CREATE VIEW resumen_cotizaciones_cliente AS
SELECT 
    cliente_nombre,
    COUNT(*) as total_cotizaciones,
    SUM(total_neto) as volumen_cotizado,
    AVG(total_neto) as ticket_promedio,
    MAX(fecha_cotizacion) as ultima_cotizacion,
    COUNT(CASE WHEN estado = 'aceptada' THEN 1 END) as cotizaciones_aceptadas
FROM cotizaciones_md
GROUP BY cliente_nombre
ORDER BY volumen_cotizado DESC;

-- Vista: Análisis de productos más cotizados
CREATE VIEW productos_mas_cotizados AS
SELECT 
    tipo_producto,
    COUNT(*) as veces_cotizado,
    AVG(precio_unitario) as precio_promedio,
    MIN(precio_unitario) as precio_minimo,
    MAX(precio_unitario) as precio_maximo,
    SUM(subtotal) as volumen_total
FROM productos_cotizacion_md pcm
JOIN cotizaciones_md cm ON pcm.cotizacion_md_id = cm.id
GROUP BY tipo_producto
ORDER BY veces_cotizado DESC;

-- Vista: Pipeline de conversión
CREATE VIEW pipeline_conversion AS
SELECT 
    estado,
    COUNT(*) as cantidad,
    SUM(total_neto) as valor_total,
    ROUND(COUNT(*)::DECIMAL / (SELECT COUNT(*) FROM cotizaciones_md) * 100, 2) as porcentaje
FROM cotizaciones_md
GROUP BY estado
ORDER BY 
    CASE estado 
        WHEN 'importada' THEN 1 
        WHEN 'enviada' THEN 2 
        WHEN 'aceptada' THEN 3 
        WHEN 'rechazada' THEN 4 
    END;
```

#### **🤖 Parser Automático de Cotizaciones**

```javascript
// Función JS para parsear cotizaciones MD automáticamente
class CotizacionMDParser {
    static parseFile(filename, content) {
        const cotizacion = {
            archivo: filename,
            fecha: this.extractDate(content),
            cliente: this.extractCliente(content),
            productos: this.extractProductos(content),
            total: this.extractTotal(content),
            condiciones: this.extractCondiciones(content)
        };
        return cotizacion;
    }
    
    static extractProductos(content) {
        const productos = [];
        const productRegex = /\d+\.\s\*\*(.+?)\s:\s(.+?)\s-\s(.+?)\*\*\s+- Precio:\s\$([0-9,]+\.\d{2})/g;
        
        let match;
        while ((match = productRegex.exec(content)) !== null) {
            const [, tipo, descripcion, dimensiones, precio] = match;
            const [ancho, alto] = this.extractDimensiones(dimensiones);
            
            productos.push({
                tipo: tipo.trim(),
                descripcion: descripcion.trim(),
                ancho_cm: ancho,
                alto_cm: alto,
                precio: parseFloat(precio.replace(',', ''))
            });
        }
        return productos;
    }
    
    static extractDimensiones(dimensiones) {
        const match = dimensiones.match(/(\d+(?:\.\d+)?)cm\s*x\s*(\d+(?:\.\d+)?)cm/);
        return match ? [parseFloat(match[1]), parseFloat(match[2])] : [null, null];
    }
    
    // Integración con BD
    static async saveToDatabase(cotizacionData) {
        const query = `
            SELECT importar_cotizacion_md($1, $2);
        `;
        return await db.query(query, [cotizacionData.archivo, JSON.stringify(cotizacionData)]);
    }
}

// Ejemplo de uso:
async function procesarCotizacionesPendientes() {
    const archivos = await fs.readdir('./cotizaciones/');
    
    for (const archivo of archivos.filter(f => f.endsWith('.md'))) {
        const contenido = await fs.readFile(`./cotizaciones/${archivo}`, 'utf8');
        const cotizacion = CotizacionMDParser.parseFile(archivo, contenido);
        await CotizacionMDParser.saveToDatabase(cotizacion);
        console.log(`✅ Cotización ${archivo} importada exitosamente`);
    }
}
```

---

**📅 Fecha de creación:** 16 de noviembre de 2025  
**🔄 Última actualización:** 18 de noviembre de 2025 (Revisión completa)  
**👤 Responsable:** Desarrollo individual  
**📊 Estado actual:** Fase 1 (30% completada - Setup en progreso)