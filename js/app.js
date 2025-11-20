import { ProductManager } from './modules/product-manager.js';
import { FormManager } from './modules/form-manager.js';
import { CategoryManager } from './modules/category-manager.js'; // NUEVO
import { QuoteGenerator } from './modules/quote-generator.js';
import { ExportManager } from './modules/export-manager.js';

class CotizacionApp {
    constructor() {
        this.state = {
            cotizacion: null,
            editando: false,
            productosArray: []
        };
        this.init();
    }

    init() {
        this.productManager = new ProductManager();
        this.formManager = new FormManager();
        this.categoryManager = new CategoryManager(); // NUEVO
        this.quoteGenerator = new QuoteGenerator();
        this.exportManager = new ExportManager(this.quoteGenerator);
        
        this.setupEventListeners();
        this.exposeGlobalFunctions();
    }

    setupEventListeners() {
        // NUEVO - Configurar event listeners para categorías
        this.categoryManager.setupEventListeners(this.formManager);

        // Event listeners para checkboxes (actualizar vista previa en tiempo real)
        ['requiereFactura', 'requiereInstalacion', 'editarFactura', 'editarInstalacion'].forEach(id => {
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.addEventListener('change', () => this.actualizarVistaPrevia());
            }
        });

        // Event listener para especificaciones de edición
        const editarEspecificaciones = document.getElementById('editarEspecificaciones');
        if (editarEspecificaciones) {
            editarEspecificaciones.addEventListener('input', () => {
                if (this.state.editando) {
                    this.actualizarVistaPrevia();
                }
            });
        }

        console.log('Event listeners configurados');
    }

    exposeGlobalFunctions() {
        // Funciones globales que ahora usan los managers
        window.mostrarFormulario = () => {
            this.mostrarFormulario();
        };
        
        window.cerrarFormulario = () => {
            this.cerrarFormulario();
        };
        
        window.agregarProducto = () => {
            this.agregarProducto();
        };
        
        window.editarCotizacion = () => {
            this.editarCotizacion();
        };
        
        window.descargarPDF = () => {
            this.exportManager.exportarPDF();
        };
        
        window.exportarMarkdown = () => {
            this.exportarComoMarkdown();
        };

        window.generarCotizacionDesdeForm = () => {
            this.generarCotizacion();
        };

        // Funciones de edición
        window.guardarEdicion = () => {
            this.guardarEdicion();
        };

        window.cerrarEdicion = () => {
            this.cerrarEdicion();
        };

        window.mostrarFormularioEnEdicion = () => {
            this.mostrarFormularioEnEdicion();
        };

        window.agregarProductoEnEdicion = () => {
            this.agregarProductoEnEdicion();
        };

        // CORREGIDO - Exponer método para eliminar productos globalmente
        window.eliminarProducto = (index) => {
            this.productManager.eliminarProducto(index);
            
            // Actualizar AMBAS vistas dinámicamente según el estado actual
            if (this.state.editando) {
                this.actualizarVistaEdicion(); // Actualizar vista de edición
            }
            this.actualizarVistaPrevia(); // Actualizar vista previa siempre
        };

        // CORREGIDO - Exponer métodos para editar productos
        window.actualizarDescripcionProducto = (index, valor) => {
            this.productManager.actualizarDescripcionProducto(index, valor);
            
            // Actualizar vista de edición si estamos editando
            if (this.state.editando) {
                // No necesitamos re-renderizar toda la vista, solo actualizar la vista previa
                this.actualizarVistaPrevia();
            }
        };

        window.actualizarPrecioProducto = (index, valor) => {
            this.productManager.actualizarPrecioProducto(index, valor);
            
            // Actualizar vista de edición si estamos editando
            if (this.state.editando) {
                // No necesitamos re-renderizar toda la vista, solo actualizar la vista previa
                this.actualizarVistaPrevia();
            }
        };

        console.log('Funciones globales expuestas');
    }

    // Mostrar formulario principal
    mostrarFormulario() {
        if (this.state.cotizacion) {
            if (confirm('¿Estás seguro de que deseas crear una nueva cotización? Los datos no guardados se perderán.')) {
                this.resetearFormulario();
            }
        } else {
            this.resetearFormulario();
        }
    }

    resetearFormulario() {
        this.formManager.mostrarFormulario();
        document.getElementById('clienteNombre').value = '';
        document.getElementById('requiereFactura').checked = false;
        document.getElementById('requiereInstalacion').checked = false;
        this.productManager.productos = [];
        this.productManager.actualizarListaHTML();
        this.state.cotizacion = null;
        
        // Limpiar vista previa cuando se resetea el formulario
        document.getElementById('vistaPrevia').textContent = '';
    }

    // Cerrar formulario principal
    cerrarFormulario() {
        this.formManager.cerrarFormulario();
        // Limpiar campos
        document.getElementById('clienteNombre').value = '';
        document.getElementById('requiereFactura').checked = false;
        document.getElementById('requiereInstalacion').checked = false;
        this.productManager.productos = [];
        this.productManager.actualizarListaHTML();
    }

    // ACTUALIZAR - Método para agregar producto
    agregarProducto() {
        // Verificar si es categoría neón (caso especial)
        const categoria = document.getElementById('categoriaProducto').value;
        let tipoProducto;
        
        if (categoria === 'neon') {
            // Para neón, usamos el tipo '3' directamente
            tipoProducto = '3';
        } else {
            // Para otras categorías, obtenemos el valor del select de subcategorías
            tipoProducto = document.getElementById('tipoProducto').value;
            
            if (!tipoProducto || tipoProducto === '') {
                alert("Seleccione un tipo de producto");
                return;
            }
        }

        const producto = this.productManager.crearProducto(tipoProducto);
        
        if (producto) {
            this.productManager.agregarProducto(producto);
            this.productManager.limpiarFormulario();
            
            // NUEVO - Limpiar selecciones de categoría
            this.categoryManager.limpiarSelecciones(false);
            
            // Ocultar campos específicos
            this.formManager.ocultarTodosLosCampos(false);
        }
    }

    // Generar cotización final
    generarCotizacion() {
        const cliente = document.getElementById('clienteNombre').value.trim();
        const requiereFactura = document.getElementById('requiereFactura').checked;
        const requiereInstalacion = document.getElementById('requiereInstalacion').checked;
        
        // Validaciones
        if (!cliente) {
            alert('Ingrese el nombre del cliente');
            return;
        }
        
        const productos = this.productManager.obtenerProductos();
        if (productos.length === 0) {
            alert('Agregue al menos un producto');
            return;
        }
        
        // Crear cotización
        this.state.cotizacion = {
            cliente: cliente,
            fecha: new Date().toLocaleDateString(),
            productos: [...productos],
            requiereFactura: requiereFactura,
            requiereInstalacion: requiereInstalacion
        };

        // Generar y mostrar vista previa
        this.actualizarVistaPrevia();
        
        // Cerrar formulario y mostrar vista previa
        this.formManager.cerrarFormulario();
        
        console.log('Cotización generada correctamente');
    }

    // Actualizar vista previa de cotización
    actualizarVistaPrevia() {
        let cliente;
        let requiereFactura;
        let requiereInstalacion;
        let especificaciones = ''; // AGREGAR especificaciones
        let productos;

        if (this.state.editando) {
            cliente = document.getElementById('editarCliente').value;
            requiereFactura = document.getElementById('editarFactura').checked;
            requiereInstalacion = document.getElementById('editarInstalacion').checked;
            especificaciones = document.getElementById('editarEspecificaciones').value; // OBTENER especificaciones
            productos = this.productManager.obtenerProductos();
        } else {
            cliente = document.getElementById('clienteNombre').value;
            requiereFactura = document.getElementById('requiereFactura').checked;
            requiereInstalacion = document.getElementById('requiereInstalacion').checked;
            // Para el formulario principal, también podemos obtener especificaciones si existe
            const especificacionesElement = document.getElementById('especificaciones');
            especificaciones = especificacionesElement ? especificacionesElement.value : '';
            productos = this.productManager.obtenerProductos();
        }

        if (!cliente || productos.length === 0) return;

        // PASAR especificaciones al generador de vista previa
        const vistaPrevia = this.quoteGenerator.generarVistaPrevia(
            productos, 
            cliente, 
            requiereFactura, 
            requiereInstalacion,
            especificaciones // AGREGAR este parámetro
        );

        document.getElementById('vistaPrevia').textContent = vistaPrevia;
    }

    // Editar cotización
    editarCotizacion() {
        if (this.productManager.obtenerProductos().length === 0) {
            alert("No hay productos para editar.");
            return;
        }

        // Cargar datos existentes
        document.getElementById('editarCliente').value = this.state.cotizacion?.cliente || '';
        document.getElementById('editarFactura').checked = this.state.cotizacion?.requiereFactura || false;
        document.getElementById('editarInstalacion').checked = this.state.cotizacion?.requiereInstalacion || false;
        document.getElementById('editarEspecificaciones').value = this.state.cotizacion?.especificaciones || '';

        // Mostrar productos en vista de edición
        this.actualizarVistaEdicion();

        // Cambiar a formulario de edición
        document.getElementById('cotizacionForm').style.display = 'none';
        document.getElementById('vistaPrevia').style.display = 'none';
        document.getElementById('editarForm').style.display = 'block';
        
        this.state.editando = true;
    }

    // Actualizar vista de edición con productos
    actualizarVistaEdicion() {
        const editarListaProductos = document.getElementById('editarListaProductos');
        if (!editarListaProductos) return;
        
        editarListaProductos.innerHTML = '';

        const productos = this.productManager.obtenerProductos();
        
        // Si no hay productos, mostrar mensaje
        if (productos.length === 0) {
            editarListaProductos.innerHTML = '<p>No hay productos para editar</p>';
            return;
        }

        productos.forEach((producto, index) => {
            const item = document.createElement('div');
            item.className = 'producto-item';
            
            item.innerHTML = `
                <div style="flex: 2;">
                    <div class="edicion-producto">
                        <input type="text" 
                            value="${producto.descripcion}" 
                            onchange="actualizarDescripcionProducto(${index}, this.value)"
                            class="input-descripcion" 
                            style="width: 100%; margin-bottom: 5px;">
                        <div class="medidas-texto">${producto.medidas || ''}</div>
                        <div class="precio-edicion" style="margin-top: 5px;">
                            <label>Precio: $</label>
                            <input type="number" 
                                value="${producto.precio}" 
                                onchange="actualizarPrecioProducto(${index}, this.value)"
                                min="0" 
                                step="0.01"
                                style="width: 100px;">
                            MXN
                        </div>
                    </div>
                </div>
                <div style="flex: 1; text-align: right;">
                    <button onclick="eliminarProducto(${index})" class="btn-secondary">
                        Eliminar
                    </button>
                </div>
            `;
            
            editarListaProductos.appendChild(item);
        });
    }

    // Mostrar formulario para agregar producto en edición
    mostrarFormularioEnEdicion() {
        const formularioNuevo = document.getElementById('formularioNuevoProducto');
        formularioNuevo.style.display = 'block';
    }

    // ACTUALIZAR - Método para agregar producto en edición
    agregarProductoEnEdicion() {
        // Verificar si es categoría neón (caso especial)
        const categoria = document.getElementById('categoriaProductoEdicion').value;
        let tipo;
        
        if (categoria === 'neon') {
            // Para neón, usamos el tipo '3' directamente
            tipo = '3';
        } else {
            // Para otras categorías, obtenemos el valor del select de subcategorías
            tipo = document.getElementById('tipoProductoEdicion').value;
            
            if (!tipo) {
                alert("Seleccione un tipo de producto");
                return;
            }
        }

        const producto = this.productManager.crearProducto(tipo, 'Edicion');
        if (producto) {
            this.productManager.agregarProducto(producto);
            this.actualizarVistaEdicion();
            this.actualizarVistaPrevia();
            
            // NUEVO - Limpiar selecciones de categoría
            this.categoryManager.limpiarSelecciones(true);
            
            // Limpiar y ocultar formulario
            document.getElementById('formularioNuevoProducto').style.display = 'none';
        }
    }

    // Guardar edición
    guardarEdicion() {
        const cliente = document.getElementById('editarCliente').value;
        if (!cliente) {
            alert("Ingrese el nombre del cliente");
            return;
        }

        // CORREGIR - Incluir especificaciones en el estado
        this.state.cotizacion = {
            cliente: cliente,
            fecha: new Date().toLocaleDateString(),
            productos: [...this.productManager.obtenerProductos()],
            especificaciones: document.getElementById('editarEspecificaciones').value, // AGREGAR
            requiereFactura: document.getElementById('editarFactura').checked,
            requiereInstalacion: document.getElementById('editarInstalacion').checked
        };

        // Actualizar vista previa final
        this.actualizarVistaPrevia();
        
        document.getElementById('editarForm').style.display = 'none';
        document.getElementById('vistaPrevia').style.display = 'block';
        this.state.editando = false;
        
        alert("Cambios guardados correctamente");
    }

    // Cerrar edición
    cerrarEdicion() {
        document.getElementById('editarForm').style.display = 'none';
        document.getElementById('vistaPrevia').style.display = 'block';
        this.state.editando = false;
        document.getElementById('formularioNuevoProducto').style.display = 'none';
    }

    // Exportar como Markdown usando la lógica original
    exportarComoMarkdown() {
        if (!this.state.cotizacion || !this.productManager.obtenerProductos().length) {
            alert("No hay cotización para exportar");
            return;
        }

        // Generar cotización para el quoteGenerator
        const opciones = {
            requiereFactura: this.state.cotizacion.requiereFactura,
            requiereInstalacion: this.state.cotizacion.requiereInstalacion,
            especificaciones: this.state.cotizacion.especificaciones
        };

        this.quoteGenerator.generar(
            this.productManager.obtenerProductos(),
            this.state.cotizacion.cliente,
            opciones
        );

        // Exportar
        this.exportManager.exportarMarkdown();
    }
}

// Inicializar la aplicación
let app;
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado, inicializando app...');
    app = new CotizacionApp();
    window.CotizacionApp = app; // Exponer para debugging
});