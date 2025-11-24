# 📋 DOCUMENTACIÓN DEL CÓDIGO - CALCULADORA XL

## 🎯 Descripción General

Sistema de generación de cotizaciones para productos publicitarios (cajas, neón, letras 3D, impresión, etc.) con arquitectura modular en JavaScript ES6.

---

## 🏗️ ARQUITECTURA DEL SISTEMA

### Estructura de Archivos

```
calculadora-xl/
├── index.html                    # Interfaz principal
├── js/
│   ├── app.js                    # Controlador principal
│   ├── temp-functions.js         # Funciones temporales de compatibilidad
│   ├── dev-scripts.js            # Scripts de desarrollo y testing
│   ├── inyectionScriptsFunctions.js # Comandos para DevScripts
│   ├── modules/                  # Módulos principales
│   │   ├── product-manager.js    # Gestión de productos
│   │   ├── form-manager.js       # Gestión de formularios
│   │   ├── category-manager.js   # Gestión de categorías
│   │   ├── quote-generator.js    # Generador de cotizaciones
│   │   └── export-manager.js     # Exportación de documentos
│   └── utils/                    # Utilidades
│       ├── calculations.js       # Cálculos matemáticos
│       └── helpers.js            # Funciones auxiliares
├── tests/
│   └── recrearCotizacionIO2025.js # Test automatizado con Playwright
├── css/styles.css                # Estilos
├── roadmap.md                    # Documentación de desarrollo
└── DOCUMENTACION.md              # Esta documentación
```

---

## 🎮 CONTROLADOR PRINCIPAL

### 📄 `app.js` - CotizacionApp

**Propósito:** Controlador central que coordina todos los módulos y gestiona el estado global.

```javascript
class CotizacionApp {
    constructor() {
        this.state = {
            cotizacion: null,      // Cotización actual
            editando: false,       // Estado de edición
            productosArray: []     // Array de productos
        };
    }
}
```

#### 🔧 Responsabilidades

- **Inicialización:** Setup de managers y event listeners
- **Estado global:** Gestión del state de la aplicación  
- **Coordinación:** Comunicación entre módulos
- **API pública:** Exposición de funciones globales

#### 📋 Métodos principales

- `mostrarFormulario()` - Muestra formulario principal
- `agregarProducto()` - Coordina adición de productos
- `editarCotizacion()` - Inicia modo edición
- `generarCotizacion()` - Genera cotización final
- `actualizarVistaPrevia()` - Actualiza vista en tiempo real

---

## 📦 MÓDULOS PRINCIPALES

### 🛒 `product-manager.js` - ProductManager

**Propósito:** Gestión completa del catálogo de productos y cálculos de precios.

```javascript
export class ProductManager {
    constructor() {
        this.productos = []; // Array de productos agregados
    }
}
```

#### 📊 Catálogo de productos soportados

| Tipo | Producto | Precio Base | Fórmula |
|------|----------|-------------|---------|
| **1** | Caja de Acrílico | $1,800/m² | `(base÷100 × altura÷100) × 1800` |
| **2** | Caja de Lona | $1,500/m² | `(base÷100 × altura÷100) × 1500` |
| **3** | Neón Normal/2.0 | $18/$25 cm² | `Calculations.sumaArea(base, altura, precio)` |
| **4** | Impresión Lona | $110/$250/$340/m² | `Calculations.multiplicacionArea × calidad` |
| **5** | Impresión Vinil | $224/$340/$460/$640/m² | `Calculations.multiplicacionArea × calidad` |
| **6** | Letras 3D | $35/$25/$30/$20/cm | `Calculations.sumaAltura(altura, precio)` |
| **7** | Letras Planas | $18/$12/cm | `Calculations.sumaAltura(altura, precio)` |
| **8** | Banner Lona | $800/$900/m² | `Calculations.multiplicacionArea × calidad` |
| **9** | Caja Circular | $45/cm² | `área × 45` |
| **10** | Personalizado | Manual | `precio fijo` |
| **11** | Caja Doble Vista | $45/cm (+$2,500 si >80cm) | `(base+altura) × 45` |

#### 🎯 Gestión de campos por producto

| Producto | Campos Mostrados |
|----------|------------------|
| **Cajas 1,2** | `#medidas` (base + altura) |
| **Neón (3)** | `#medidas` + `#opcionesNeon` (tipoNeon) |
| **Impresiones (4,5)** | `#medidas` + `#opcionesLona/Vinil` (calidad) |
| **Letras 3D (6)** | `#opcionesLetras3D` (altura3D, material3D, base3D, alturaInfo3D) |
| **Letras Planas (7)** | `#opcionesLetrasPlanas` (alturaPlanas, materialPlanas, basePlanas, alturaInfoPlanas) |
| **Banner (8)** | `#medidas` + `#opcionesBanner` (calidadBanner) |
| **Circular (9)** | `#opcionesCircular` (areaCircular) |
| **Personalizado (10)** | `#otroProducto` (descripcionOtro, costoOtro) |
| **Doble Vista (11)** | `#opcionesDobleVista` (baseDobleVista, alturaDobleVista) |

---

### 📋 `form-manager.js` - FormManager

**Propósito:** Gestión de formularios y campos dinámicos.

```javascript
export class FormManager {
    mostrarFormulario();           // Muestra formulario principal
    cerrarFormulario();            // Cierra formulario
    ocultarTodosLosCampos(esEdicion); // Limpia campos específicos
    mostrarCamposEspecificos(tipo, esEdicion); // Muestra campos por tipo
}
```

---

### 🏷️ `category-manager.js` - CategoryManager

**Propósito:** Gestión dinámica de categorías y subcategorías.

```javascript
export class CategoryManager {
    constructor() {
        this.categorias = {
            cajas: [
                { value: '1', text: 'Caja de Acrílico' },
                { value: '2', text: 'Caja de Lona' },
                { value: '9', text: 'Caja Circular' }
            ],
            neon: [{ value: '3', text: 'Neón' }],
            // ... más categorías
        };
    }
}
```

#### 🔗 Flujo de selección

1. **Usuario selecciona categoría** → Trigger `categoriaProducto.change`
2. **CategoryManager actualiza subcategorías** → Pobla `#tipoProducto`  
3. **Usuario selecciona tipo** → FormManager muestra campos específicos
4. **Caso especial Neón:** Salta subcategorías, muestra opciones directamente

#### ⚙️ Métodos principales

- `actualizarSubcategorias(categoria, esEdicion, formManager)` 
- `setupEventListeners(formManager)` - Configura eventos
- `limpiarSelecciones(esEdicion)` - Reset de selecciones
- `obtenerCategoriaPorTipo(tipo)` - Mapping inverso

---

### 📋 `quote-generator.js` - QuoteGenerator

**Propósito:** Generación de cotizaciones y vista previa.

```javascript
export class QuoteGenerator {
    generar(productos, cliente, opciones = {});
    generarVistaPrevia(productos, cliente, requiereFactura, requiereInstalacion, especificaciones);
    generarContenidoMarkdown();
}
```

#### 💰 Lógica de precios

```javascript
// SOLO IVA si requiere factura, instalación es informativa
if (requiereFactura) {
    const iva = subtotal * 0.16;
    total = subtotal + iva;
} else {
    total = subtotal; // Sin IVA
}

// Instalación NO se cobra - solo se menciona como incluida
```

#### 📄 Formatos de salida

- **Vista previa:** Texto plano para `#vistaPrevia`
- **Markdown:** Para exportación con formato profesional

---

### 📤 `export-manager.js` - ExportManager

**Propósito:** Exportación de cotizaciones en múltiples formatos.

```javascript
export class ExportManager {
    constructor(quoteGenerator) {
        this.quoteGenerator = quoteGenerator;
    }
    
    exportarMarkdown();  // Exporta como .md
    exportarPDF();       // [PENDIENTE] Exportar como PDF
}
```

#### 📁 Nombrado automático
`cotizacion_Cliente_YYYY-MM-DD.md`

---

## 🧮 MÓDULOS DE UTILIDADES

### 📊 `calculations.js` - Calculations

**Propósito:** Cálculos matemáticos centralizados.

```javascript
export const Calculations = {
    // Área × precio por m² (para impresiones/banners)
    multiplicacionArea(base, altura, precio) {
        return ((base * altura) * (precio / 10000));
    },
    
    // Altura × precio por cm (para letras)
    sumaAltura(altura, precio) {
        return altura * precio;
    },
    
    // (Base + Altura) × precio (para cajas/neón)
    sumaArea(base, altura, precio) {
        return (base + altura) * precio;
    },
    
    // IVA mexicano
    calcularIVA(subtotal) {
        return subtotal * 0.16;
    }
};
```

---

### 🛠️ `helpers.js` - Helpers

**Propósito:** Funciones auxiliares comunes.

```javascript
export const Helpers = {
    // Formateo de números con comas
    formatearNumero(numero) {
        return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    
    // Sistema de mensajes con estilos
    mostrarMensaje(mensaje, tipo) {
        // tipos: 'success', 'error', 'info'
    },
    
    // Limpieza masiva de formularios
    limpiarFormulario(campos) {
        // Array de IDs para limpiar
    }
};
```

---

## 🔧 FUNCIONES DE DESARROLLO

### 🧪 `dev-scripts.js` - DevScripts

**Propósito:** Herramientas de desarrollo y testing automático.

```javascript
const DevScripts = {
    // TESTING BÁSICO
    testSimple(),                    // Test de 1 producto
    recrearCotizacionIO2025(),       // Test completo (11 productos)
    
    // EDICIÓN AVANZADA  
    editarCotizacionPersonalizada(config),
    eliminarProductoPorIndice(indice),
    
    // DEBUGGING
    debugearElementos(),
    investigarFormularioEdicion(),
    contarProductosReales(),
    
    // FLUJOS COMPLETOS
    flujoCompletoIO2025(),          // Crear + Editar automático
    crearIO4Directo(),              // Variantes específicas
    
    // UTILIDADES
    limpiarTodo(),
    mostrarAyuda()
};
```

#### 🎯 Casos de uso principales

```javascript
// Test rápido
DevScripts.testSimple()

// Cotización completa IO (11 productos)
DevScripts.recrearCotizacionIO2025()

// Edición personalizada
DevScripts.editarCotizacionPersonalizada({
    nuevoNombre: 'Cliente Nuevo',
    eliminarIndices: [0, 1, 2],
    nuevosProductos: [
        { categoria: 'cajas', tipo: '1', config: { base: 200, altura: 300 } }
    ]
})
```

---

### 🎭 `recrearCotizacionIO2025.js` - Test Playwright

**Propósito:** Test automatizado E2E con Playwright.

```javascript
import { chromium } from 'playwright';

async function recrearCotizacionIO2025() {
    // 1. Lanzar navegador
    // 2. Configurar cliente: 'IO'
    // 3. Agregar 11 productos automáticamente
    // 4. Generar cotización
    // 5. Verificar resultado
}
```

#### 🔧 Características del test

- **Navegador visual:** `headless: false` para debugging
- **Manejo de neón:** Lógica especial para categoría neón sin subcategorías
- **Verificación robusta:** Múltiples métodos de conteo de productos
- **Logging detallado:** Console output para debugging

---

## 🌐 FUNCIONES GLOBALES

### ⚙️ `temp-functions.js` - Funciones de Compatibilidad

**Propósito:** Bridge entre funciones globales del HTML y arquitectura modular.

```javascript
// Funciones principales expuestas globalmente
window.mostrarFormulario = () => app.mostrarFormulario();
window.agregarProducto = () => app.agregarProducto();
window.editarCotizacion = () => app.editarCotizacion();
window.generarCotizacionDesdeForm = () => app.generarCotizacion();

// Funciones de edición
window.eliminarProducto = (index) => app.productManager.eliminarProducto(index);
window.actualizarDescripcionProducto = (index, valor) => { /* ... */ };
window.actualizarPrecioProducto = (index, valor) => { /* ... */ };
```

---

## 📱 INTERFAZ DE USUARIO

### 🎨 `index.html` - Estructura HTML

#### 📋 Componentes principales

##### 1. Botones de Acción
```html
<div class="button-group">
    <button onclick="mostrarFormulario()">Generar Cotización</button>
    <button onclick="editarCotizacion()">Editar Datos</button>
    <button onclick="descargarPDF()">Descargar PDF</button>
    <button onclick="exportarMarkdown()">Exportar como MD</button>
</div>
```

##### 2. Formulario Principal (#cotizacionForm)
- **Cliente:** `#clienteNombre`
- **Categorías:** `#categoriaProducto` → `#subcategorias` → `#tipoProducto` 
- **Campos dinámicos:** Se muestran según el tipo seleccionado
- **Lista de productos:** `#listaProductos`
- **Opciones:** Factura e Instalación

##### 3. Formulario de Edición (#editarForm)
- **Edición de cliente:** `#editarCliente`
- **Lista editable:** `#editarListaProductos` con inputs inline
- **Especificaciones:** `#editarEspecificaciones` (textarea)
- **Subformulario:** `#formularioNuevoProducto` para agregar productos

##### 4. Vista Previa (#vistaPrevia)
- **Elemento:** `<pre>` con texto plano de la cotización
- **Actualización:** En tiempo real durante edición

---

## 🔄 FLUJOS DE TRABAJO

### 📝 Flujo de Creación de Cotización

```
1. Click "Generar Cotización"
   ↓
2. Completar datos de cliente
   ↓
3. Para cada producto:
   a) Seleccionar categoría → subcategorías aparecen
   b) Seleccionar tipo → campos específicos aparecen  
   c) Llenar medidas/opciones
   d) Click "Agregar Producto" → producto se añade a lista
   ↓
4. Click "Generar Cotización" → Vista previa se muestra
```

### ✏️ Flujo de Edición

```
1. Click "Editar Datos" (con productos existentes)
   ↓
2. Formulario de edición se abre con:
   - Datos del cliente cargados
   - Lista de productos con inputs editables
   - Opción de agregar nuevos productos
   ↓
3. Modificaciones en tiempo real actualizan vista previa
   ↓
4. Click "Guardar Cambios" → Estado se actualiza
```

### 🎯 Flujo Especial de Neón

```
1. Seleccionar categoría "neon"
   ↓
2. CategoryManager detecta caso especial:
   - NO muestra div #subcategorias  
   - Muestra directamente #medidas + #opcionesNeon
   ↓
3. ProductManager usa tipo '3' automáticamente
```

---

## 📊 DATOS Y ESTADO

### 🗃️ Estructura de Producto

```javascript
{
    tipo: '1',                           // ID del tipo
    descripcion: 'Caja de Acrílico',     // Nombre para mostrar
    precio: 1080,                        // Precio calculado
    medidas: '120cm x 240cm'            // Texto de medidas (opcional)
}
```

### 📋 Estructura de Cotización

```javascript
{
    cliente: 'Nombre Cliente',
    fecha: '20/11/2025', 
    productos: [...],                    // Array de productos
    requiereFactura: true,              // IVA sí/no
    requiereInstalacion: false,         // Solo informativo
    especificaciones: 'Texto opcional'  // Campo libre
}
```

### ⚙️ Estado Global (app.state)

```javascript
{
    cotizacion: {...},                  // Cotización actual
    editando: false,                    // Modo edición activo
    productosArray: [...]               // [No usado actualmente]
}
```

---

## 🧪 TESTING Y DESARROLLO

### 📋 Comandos de DevScripts Disponibles

#### 🔧 Testing básico
```javascript
DevScripts.testSimple()                    // 1 producto simple
DevScripts.recrearCotizacionIO2025()       // 11 productos completos
DevScripts.debugearElementos()             // Verificar estado DOM
```

#### ✏️ Edición avanzada
```javascript
DevScripts.editarCotizacionPersonalizada({
    nuevoNombre: 'IO',
    eliminarIndices: [0, 1, 2],
    nuevosProductos: [
        { categoria: 'neon', tipo: '3', config: { base: 150, altura: 150, tipoNeon: '2' } }
    ]
})
```

#### 🛠️ Utilidades
```javascript
DevScripts.limpiarTodo()               // Reset completo
DevScripts.contarProductosReales()     // Debug productos actuales
DevScripts.mostrarAyuda()              // Ver todos los comandos
```

### 🎭 Test E2E con Playwright

```bash
# Instalar dependencias
npm install playwright
npx playwright install chromium

# Ejecutar test
cd tests
node recrearCotizacionIO2025.js
```

---

## 🚀 PRÓXIMOS DESARROLLOS

### 📋 Según roadmap.md

#### Fase 1 (ACTUAL): Automatización con Playwright
- ✅ Setup básico completado
- 🟡 Tests E2E en desarrollo

#### Fase 2: Integración Base de Datos
- PostgreSQL para persistencia
- Sistema de clientes y historial
- Templates de productos

#### Fase 3: IA Integration
- Análisis automático de planos
- Cotización de letras 3D desde imágenes
- OCR de dimensiones

#### Features pendientes
- **Modal vs alerts:** Reemplazar `alert()` nativo
- **PDF membretado:** Export profesional con logo
- **Nuevos productos:** Bastidores, toldos, señaléticas
- **Cálculo de viáticos:** Sistematizar costos de transporte

---

## 📖 GUÍA DE USO PARA DESARROLLADORES

### 🔧 Setup del entorno

```bash
# Clonar repositorio
git clone https://github.com/lynch36/calculadora-xl.git
cd calculadora-xl

# Servidor local
npx http-server -p 8080
# O simplemente abrir index.html en navegador
```

### 🧪 Testing rápido

```javascript
// Abrir DevTools y ejecutar:
DevScripts.testSimple()                    // Test básico
DevScripts.recrearCotizacionIO2025()       // Test completo
DevScripts.mostrarAyuda()                  // Ver comandos disponibles
```

### 🔍 Debugging común

```javascript
// Verificar estado actual
window.CotizacionApp                       // Acceso a app
app.productManager.productos               // Ver productos actuales
app.state                                  // Ver estado global

// Debug elementos DOM
DevScripts.debugearElementos()
DevScripts.investigarFormularioEdicion()
```

### 📝 Agregar nuevo tipo de producto

#### 1. Actualizar CategoryManager
```javascript
// En category-manager.js
this.categorias.nuevaCategoria = [
    { value: '11', text: 'Nuevo Producto' }
];
```

#### 2. Actualizar ProductManager
```javascript
// En product-manager.js - método crearProducto()
case "11":
    // Lógica del nuevo producto
    break;
```

#### 3. Actualizar FormManager
```javascript
// Agregar campos específicos en HTML
// Actualizar mostrarCamposEspecificos()
```

### 🎯 Extensión de funcionalidad

- **Nuevos cálculos:** Agregar a `calculations.js`
- **Nuevos helpers:** Agregar a `helpers.js`
- **Nuevos tests:** Extender `dev-scripts.js`
- **Nueva UI:** Modificar `form-manager.js` + HTML

---

## 🔧 RESOLUCIÓN DE PROBLEMAS COMUNES

### ❌ "Función no definida" en DevTools

**Causa:** Las funciones están en módulos ES6  
**Solución:** Usar `app.metodo()` en lugar de `metodo()` directamente

```javascript
// ❌ Error
mostrarFormulario()

// ✅ Correcto
app.mostrarFormulario()
```

### ❌ Neón no se agrega correctamente

**Causa:** Neón tiene flujo especial sin subcategorías  
**Solución:** Usar CategoryManager apropiadamente

```javascript
// Para neón, NO existe #subcategorias ni #tipoProducto
// Solo #opcionesNeon con #tipoNeon
```

### ❌ Tests de Playwright fallan

**Causa:** Elementos no encontrados o timing  
**Solución:** Verificar selectores y aumentar timeouts

```javascript
// Usar waits explícitos
await page.waitForSelector('#elemento', { timeout: 5000 });
```

### ❌ Cotización no se genera

**Causa:** Botón incorrecto o función no encontrada  
**Solución:** Verificar que se use `generarCotizacionDesdeForm()`

```javascript
// ❌ Genérico
await page.click('text=Generar Cotización');

// ✅ Específico
await page.click('button[onclick*="generarCotizacionDesdeForm"]');
```

---

## 📚 CONCLUSIÓN

El sistema **Calculadora XL** está diseñado con una **arquitectura modular robusta** que permite:

- ✅ **Fácil mantenimiento** - Cada módulo tiene responsabilidad única
- ✅ **Extensibilidad** - Agregar nuevos productos/funcionalidades es sencillo  
- ✅ **Testing automatizado** - DevScripts y Playwright para QA
- ✅ **Desarrollo iterativo** - Roadmap claro hacia funcionalidades avanzadas

La separación entre **lógica de negocio** (módulos), **interfaz** (HTML/CSS) y **testing** (dev-scripts) asegura un código **mantenible y escalable** para el crecimiento futuro del proyecto.

---

## 📞 CONTACTO Y SOPORTE

- **Repositorio:** https://github.com/lynch36/calculadora-xl
- **Issues:** Reportar bugs y solicitar features en GitHub Issues
- **Documentación:** Este archivo + `roadmap.md`

---

*Documentación generada: 20 de noviembre de 2025*  
*Versión del sistema: 1.0.0*  
*Última actualización: Fase 1 - Setup Playwright*