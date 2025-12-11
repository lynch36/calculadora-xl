import { ProductManager } from './modules/product-manager.js';
import { FormManager } from './modules/form-manager.js';
import { CategoryManager } from './modules/category-manager.js'; // NUEVO
import { QuoteGenerator } from './modules/quote-generator.js';
import { ExportManager } from './modules/export-manager.js';
import { Helpers } from './utils/helpers.js';

class CotizacionApp {
    constructor() {
        this.state = {
            cotizacion: null,
            editando: false,
            productosArray: []
        };
        // 1. Inicializar managers
        this.productManager = new ProductManager();
        this.categoryManager = new CategoryManager();
        this.formManager = new FormManager();
        this.quoteGenerator = new QuoteGenerator();
        this.exportManager = new ExportManager(this.quoteGenerator);
        
        // 2. Configurar relaciones
        this.categoryManager.setupEventListeners(this.formManager);
        this.quoteGenerator.setProductManager(this.productManager); // ✅ DESCOMENTA esta línea
    
        // 3. Event listeners específicos de la app
        this.setupEventListeners();
        
        this.exposeGlobalFunctions();
    }

    // ✅ MODIFICADO: Configurar event listeners incluyendo editor
    setupEventListeners() {
        // Event listeners para el flujo por pasos (formulario nuevo)
        this.setupPasosPorPasos();
        
        // Event listener para zona de servicio
        const zonaServicio = document.getElementById('zonaServicio');
        if (zonaServicio) {
            zonaServicio.addEventListener('change', () => {
                this.handleZonaChange();
            });
        }

        // Event listener para kilómetros
        const kilometros = document.getElementById('kilometros');
        if (kilometros) {
            kilometros.addEventListener('input', () => {
                this.handleViaticosChange();
            });
        }

        // Event listener para monto extra
        const montoExtra = document.getElementById('montoExtra');
        if (montoExtra) {
            montoExtra.addEventListener('input', () => {
                this.handleViaticosChange();
            });
        }

        // ✅ NUEVO: Event listeners para tipo de viático (implícito/explícito)
        const radiosTipoViatico = document.querySelectorAll('input[name="tipoViatico"]');
        radiosTipoViatico.forEach(radio => {
            radio.addEventListener('change', () => {
                this.handleTipoViaticoChange();
            });
        });
        
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
                this.actualizarVistaPrevia();
            });
        }

        console.log('Event listeners configurados');
    }

    // ✅ NUEVO: Manejar cambio de tipo de viático
    handleTipoViaticoChange() {
        const tipoViatico = document.querySelector('input[name="tipoViatico"]:checked')?.value;
        console.log('🔄 Tipo de viático cambiado a:', tipoViatico);
        
        // Recalcular viáticos con el nuevo tipo
        if (this.productManager && this.productManager.productos.length > 0) {
            this.productManager.recalcularViaticos();
            this.productManager.actualizarTabla();
            
            const zona = document.getElementById('zonaServicio')?.value;
            if (zona === 'cdmx') {
                console.log(`✅ Viáticos CDMX ahora ${tipoViatico === 'explicito' ? 'como producto separado' : 'incluidos en productos'}`);
            } else if (zona === 'otro') {
                const km = document.getElementById('kilometros').value;
                const extra = document.getElementById('montoExtra').value;
                if (km || extra) {
                    console.log(`✅ Viáticos otros estados ahora ${tipoViatico === 'explicito' ? 'como producto separado' : 'incluidos en productos'}`);
                }
            }
        }
    }

    handleZonaChange() {
        const zona = document.getElementById('zonaServicio')?.value;
        const campoKilometros = document.getElementById('campoKilometros');
        
        console.log('🌍 Zona cambiada a:', zona);
        
        // Mostrar/ocultar campo de kilómetros según la zona
        if (zona === 'otro') {
            campoKilometros.style.display = 'block';
        } else {
            campoKilometros.style.display = 'none';
            // Limpiar kilómetros y monto extra cuando se cambia a CDMX
            document.getElementById('kilometros').value = '';
            document.getElementById('montoExtra').value = '';
        }
        
        // Recalcular viáticos de todos los productos existentes
        if (this.productManager && this.productManager.productos.length > 0) {
            this.productManager.recalcularViaticos();
            this.productManager.actualizarTabla();
        }
        
        // Mostrar mensaje
        this.mostrarMensajeViaticos();
    }

    handleViaticosChange() {
        const zona = document.getElementById('zonaServicio')?.value;
        const kilometros = document.getElementById('kilometros').value;
        const montoExtra = document.getElementById('montoExtra').value;
        
        console.log('🛣️ Viáticos cambiados - Km:', kilometros, 'Extra:', montoExtra);
        
        // Solo recalcular si estamos en zona "otro" y hay productos
        if (zona === 'otro' && this.productManager && this.productManager.productos.length > 0) {
            this.productManager.recalcularViaticos();
            this.productManager.actualizarTabla();
            this.mostrarMensajeViaticos();
        }
    }

    // ✅ NUEVO: Método auxiliar para mostrar mensajes de viáticos
    mostrarMensajeViaticos() {
        const zona = document.getElementById('zonaServicio')?.value;
        const tipoViatico = document.querySelector('input[name="tipoViatico"]:checked')?.value || 'implicito';
        const totalProductos = this.productManager ? this.productManager.productos.filter(p => !p.esViatico).length : 0;
        
        // Verificar si se requiere instalación
        let requiereInstalacion = false;
        const instalacionCheckbox = document.getElementById('requiereInstalacion');
        const editarInstalacionCheckbox = document.getElementById('editarInstalacion');
        
        if (instalacionCheckbox) {
            requiereInstalacion = instalacionCheckbox.checked;
        } else if (editarInstalacionCheckbox) {
            requiereInstalacion = editarInstalacionCheckbox.checked;
        }
        
        let mensaje;
        
        // ✅ CORREGIDO: Lógica actualizada para viáticos
        if (zona === 'cdmx' || requiereInstalacion) {
            // Viáticos fijos de $1,000
            const metodo = tipoViatico === 'explicito' ? 'como producto separado' : `distribuidos entre ${totalProductos} productos`;
            let razon = '';
            
            if (zona === 'cdmx' && requiereInstalacion) {
                razon = '(CDMX + Instalación)';
            } else if (zona === 'cdmx') {
                razon = '(CDMX)';
            } else if (requiereInstalacion) {
                razon = '(Instalación requerida)';
            }
            
            mensaje = `Viáticos de $1,000 ${razon} ${metodo}`;
        } else if (zona === 'otro') {
            // Viáticos variables para otros estados (solo fabricación)
            const km = document.getElementById('kilometros').value;
            const extra = document.getElementById('montoExtra').value;
            let detalles = [];
            if (km > 0) detalles.push(`${km}km`);
            if (extra > 0) detalles.push(`$${extra} extra`);
            
            if (detalles.length > 0) {
                const metodo = tipoViatico === 'explicito' ? 'como producto separado' : `distribuidos entre ${totalProductos} productos`;
                mensaje = `Viáticos por ${detalles.join(' + ')} ${metodo}`;
            } else {
                mensaje = 'Para otros estados (solo fabricación): especifique kilómetros y/o monto extra para calcular viáticos';
            }
        } else {
            mensaje = 'Seleccione zona de servicio. Viáticos se aplican automáticamente para CDMX o instalaciones';
        }
        
        Helpers.mostrarMensaje(mensaje, "info");
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

        // ✅ AGREGAR ESTA LÍNEA
        window.eliminarProductoEdicion = (index) => {
            this.eliminarProductoEdicion(index);
        };

        // ✅ NUEVO: Funciones para formulario dinámico
        window.guardarEdicionDinamica = () => {
            this.guardarEdicionDinamica();
        };

        window.cerrarEdicionDinamica = () => {
            this.cerrarEdicionDinamica();
        };

        window.eliminarProductoEdicionDinamica = (index) => {
            this.eliminarProductoEdicionDinamica(index);
        };

        console.log('Funciones globales expuestas');
    }

    // Mostrar formulario principal
    mostrarFormulario() {
        // ✅ AGREGAR: Asegurar que no esté en modo edición
        document.body.classList.remove('editing');
        const editarForm = document.getElementById('editarForm');
        if (editarForm) {
            editarForm.classList.remove('show');
        }
        
        // Validar si hay cotización existente
        if (this.state.cotizacion) {
            const confirmar = confirm('¿Estás seguro de que deseas crear una nueva cotización? Los datos no guardados se perderán.');
            if (!confirmar) {
                return;
            }
        }
        
        this.resetearFormulario();
    }

    resetearFormulario() {
        // ✅ AGREGAR: Asegurar que no esté en modo edición
        document.body.classList.remove('editing');
        
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
        const categoria = document.getElementById('categoriaProducto').value;
        const tipo = document.getElementById('tipoProducto').value;
        
        if (categoria === 'neon') {
            const producto = this.productManager.crearProducto('3');
            if (producto) {
                this.productManager.agregarProducto(producto);
                this.productManager.limpiarFormulario(); // ← Solo campos de producto
                this.categoryManager.limpiarSelecciones(false); // ← Solo categoría/tipo  
                this.formManager.ocultarTodosLosCampos(false); // ← Solo opciones específicas
                
                // NO tocar clienteNombre ni zonaServicio
            }
            return;
        }
        
        if (!tipo) {
            alert("Seleccione un tipo de producto");
            return;
        }
        
        const producto = this.productManager.crearProducto(tipo);
        if (producto) {
            this.productManager.agregarProducto(producto);
            this.productManager.limpiarFormulario(); // ← Solo campos de producto  
            this.categoryManager.limpiarSelecciones(false); // ← Solo categoría/tipo  
            this.formManager.ocultarTodosLosCampos(false); // ← Solo opciones específicas
            
            // NO tocar clienteNombre ni zonaServicio
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

        // Guardar cotización temporal en LocalStorage
        localStorage.setItem('cotizacionTemporal', JSON.stringify(this.state.cotizacion));

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
            especificaciones
        );

        document.getElementById('vistaPrevia').textContent = vistaPrevia;
    }

    // Versión simplificada para debug
    editarCotizacion() {
        console.log('🚀 INICIANDO EDICIÓN CON FORMULARIO DINÁMICO...');
        
        if (this.productManager.obtenerProductos().length === 0) {
            alert("No hay productos para editar.");
            return;
        }

        // Eliminar cualquier formulario dinámico existente
        const existente = document.getElementById('editarFormDinamico');
        if (existente) {
            existente.remove();
        }

        // Ocultar elementos principales
        document.body.classList.add('editing-mode');
        
        // Crear formulario completamente nuevo
        const formulario = document.createElement('div');
        formulario.id = 'editarFormDinamico';
        formulario.innerHTML = `
            <div style="
                background: #ffffff;
                border: 3px solid #007bff;
                border-radius: 12px;
                padding: 30px;
                margin: 20px auto;
                max-width: 900px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.15);
                position: relative;
                z-index: 10000;
                font-family: 'Roboto', sans-serif;
            ">
                <h2 style="
                    color: #007bff; 
                    text-align: center; 
                    margin-bottom: 25px; 
                    font-size: 28px; 
                    font-weight: 700;
                    border-bottom: 2px solid #007bff;
                    padding-bottom: 15px;
                ">
                    🔧 Editar Cotización
                </h2>

                <!-- Cliente -->
                <div style="margin-bottom: 25px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333; font-size: 16px;">
                        👤 Nombre del Cliente:
                    </label>
                    <input 
                        type="text" 
                        id="editarClienteDinamico" 
                        value="${this.state.cotizacion?.cliente || ''}"
                        style="
                            width: 100%; 
                            padding: 12px 16px; 
                            border: 2px solid #e0e0e0; 
                            border-radius: 8px; 
                            font-size: 16px;
                            transition: border-color 0.3s ease;
                            box-sizing: border-box;
                        "
                        onkeyup="this.style.borderColor = this.value ? '#28a745' : '#e0e0e0';"
                    >
                </div>

                <!-- Tipo de Servicio -->
                <div style="
                    margin-bottom: 25px; 
                    padding: 20px; 
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); 
                    border-radius: 10px; 
                    border: 1px solid #dee2e6;
                ">
                    <h3 style="margin: 0 0 15px 0; color: #495057; font-size: 18px;">🔧 Tipo de Servicio</h3>
                    
                    <label style="
                        display: block; 
                        margin-bottom: 15px; 
                        cursor: pointer; 
                        padding: 15px; 
                        background: white; 
                        border: 2px solid #dee2e6; 
                        border-radius: 8px;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.borderColor='#80bdff'" onmouseout="this.style.borderColor='#dee2e6'">
                        <input 
                            type="radio" 
                            name="tipoServicioEditar" 
                            value="conInstalacion" 
                            id="editarRadioConInstalacionDinamico"
                            ${this.state.cotizacion?.requiereInstalacion ? 'checked' : ''}
                            style="margin-right: 12px; transform: scale(1.3);"
                        >
                        <strong style="color: #28a745;">✅ Sí, incluye instalación</strong>
                        <br><small style="margin-left: 25px; color: #666;">Requiere selección de zona para calcular viáticos</small>
                    </label>
                    
                    <label style="
                        display: block; 
                        cursor: pointer; 
                        padding: 15px; 
                        background: white; 
                        border: 2px solid #dee2e6; 
                        border-radius: 8px;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.borderColor='#80bdff'" onmouseout="this.style.borderColor='#dee2e6'">
                        <input 
                            type="radio" 
                            name="tipoServicioEditar" 
                            value="soloFabricacion" 
                            id="editarRadioSoloFabricacionDinamico"
                            ${!this.state.cotizacion?.requiereInstalacion ? 'checked' : ''}
                            style="margin-right: 12px; transform: scale(1.3);"
                        >
                        <strong style="color: #17a2b8;">📦 Solo fabricación</strong>
                        <br><small style="margin-left: 25px; color: #666;">Sin viáticos - No requiere zona</small>
                    </label>
                </div>

                <!-- Configuración Zona (solo si requiere instalación) -->
                <div id="editarConfiguracionZonaDinamico" style="
                    margin-bottom: 25px; 
                    padding: 20px; 
                    background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); 
                    border-radius: 10px; 
                    border: 1px solid #2196F3;
                    ${this.state.cotizacion?.requiereInstalacion ? 'display: block;' : 'display: none;'}
                ">
                    <h3 style="margin: 0 0 15px 0; color: #1976d2; font-size: 18px;">🌍 Zona de Instalación</h3>
                    
                    <label style="display: block; margin-bottom: 10px; font-weight: 600; color: #333;">
                        Zona de instalación:
                    </label>
                    <select id="editarZonaServicioDinamico" style="
                        width: 100%; 
                        padding: 12px 16px; 
                        border: 2px solid #e0e0e0; 
                        border-radius: 8px; 
                        font-size: 16px;
                        box-sizing: border-box;
                        background: white;
                    ">
                        <option value="">Seleccionar zona...</option>
                        <option value="cdmx" ${this.state.cotizacion?.zonaServicio === 'cdmx' ? 'selected' : ''}>
                            CDMX / Zona Metropolitana ($1,000 viáticos fijos)
                        </option>
                        <option value="otro" ${this.state.cotizacion?.zonaServicio === 'otro' ? 'selected' : ''}>
                            Otro Estado (viáticos calculados por distancia)
                        </option>
                    </select>
                    
                    <!-- Campos para otros estados -->
                    <div id="editarCampoKilometrosDinamico" style="
                        margin-top: 20px; 
                        padding: 15px; 
                        background: rgba(255,255,255,0.7); 
                        border-radius: 8px;
                        ${this.state.cotizacion?.zonaServicio === 'otro' ? 'display: block;' : 'display: none;'}
                    ">
                        <h4 style="margin: 0 0 15px 0; color: #1976d2;">📏 Configuración de Viáticos</h4>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                            <div>
                                <label style="display: block; margin-bottom: 5px; font-weight: 600;">Kilómetros:</label>
                                <input type="number" id="editarKilometrosDinamico" min="0" step="1" 
                                       value="${this.state.cotizacion?.kilometros || ''}"
                                       style="width: 100%; padding: 10px; border: 2px solid #e0e0e0; border-radius: 6px; box-sizing: border-box;">
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 5px; font-weight: 600;">Monto extra:</label>
                                <input type="number" id="editarMontoExtraDinamico" min="0" step="0.01" 
                                       value="${this.state.cotizacion?.montoExtra || ''}"
                                       style="width: 100%; padding: 10px; border: 2px solid #e0e0e0; border-radius: 6px; box-sizing: border-box;">
                            </div>
                        </div>
                        
                        <div>
                            <label style="display: block; margin-bottom: 10px; font-weight: 600;">Mostrar viáticos:</label>
                            <div style="display: flex; gap: 20px;">
                                <label style="cursor: pointer;">
                                    <input type="radio" name="editarTipoViatico" value="implicito" 
                                           ${!this.state.cotizacion?.tipoViatico || this.state.cotizacion?.tipoViatico === 'implicito' ? 'checked' : ''}
                                           style="margin-right: 8px;">
                                    Incluidos en productos
                                </label>
                                <label style="cursor: pointer;">
                                    <input type="radio" name="editarTipoViatico" value="explicito" 
                                           ${this.state.cotizacion?.tipoViatico === 'explicito' ? 'checked' : ''}
                                           style="margin-right: 8px;">
                                    Como producto separado
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Factura -->
                <div style="margin-bottom: 25px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                    <label style="display: flex; align-items: center; cursor: pointer; font-size: 16px; font-weight: 500;">
                        <input type="checkbox" id="editarRequiereFacturaDinamico" 
                               ${this.state.cotizacion?.requiereFactura ? 'checked' : ''}
                               style="margin-right: 12px; transform: scale(1.3);">
                        📄 Requiere Factura (IVA)
                    </label>
                </div>

                <!-- Productos -->
                <div style="margin-bottom: 25px;">
                    <h3 style="margin: 0 0 15px 0; color: #495057; font-size: 18px; padding-bottom: 10px; border-bottom: 2px solid #e9ecef;">
                        📦 Productos en la Cotización
                    </h3>
                    <div id="editarListaProductosDinamica" style="
                        border: 2px solid #e9ecef; 
                        border-radius: 8px; 
                        padding: 20px; 
                        min-height: 120px; 
                        background: #f8f9fa;
                        max-height: 300px;
                        overflow-y: auto;
                    ">
                        <div style="text-align: center; color: #666;">Cargando productos...</div>
                    </div>
                </div>

                <!-- Especificaciones -->
                <div style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 10px; font-weight: 600; color: #333; font-size: 16px;">
                        📝 Especificaciones adicionales:
                    </label>
                    <textarea id="editarEspecificacionesDinamico" rows="4" 
                             style="
                                width: 100%; 
                                padding: 12px 16px; 
                                border: 2px solid #e0e0e0; 
                                border-radius: 8px; 
                                font-size: 16px; 
                                resize: vertical;
                                box-sizing: border-box;
                                font-family: inherit;
                             ">${this.state.cotizacion?.especificaciones || ''}</textarea>
                </div>

                <!-- Botones -->
                <div style="text-align: center; border-top: 2px solid #e9ecef; padding-top: 25px;">
                    <button onclick="app.guardarEdicionDinamica()" style="
                        background: linear-gradient(135deg, #28a745 0%, #20c997 100%); 
                        color: white; 
                        border: none; 
                        padding: 15px 35px; 
                        border-radius: 8px; 
                        font-size: 16px; 
                        font-weight: 600; 
                        margin-right: 15px; 
                        cursor: pointer;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
                    " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                        ✅ Guardar Cambios
                    </button>
                    <button onclick="app.cerrarEdicionDinamica()" style="
                        background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); 
                        color: white; 
                        border: none; 
                        padding: 15px 35px; 
                        border-radius: 8px; 
                        font-size: 16px; 
                        font-weight: 600; 
                        cursor: pointer;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
                    " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                        ❌ Cancelar
                    </button>
                </div>
            </div>
        `;

        // Agregar al DOM
        const container = document.querySelector('.container');
        container.appendChild(formulario);

        // Configurar funcionalidad
        this.cargarProductosEnListaDinamica();
        this.configurarEventListenersEdicionDinamica();

        // Scroll suave hacia el formulario
        setTimeout(() => {
            formulario.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Notificación de éxito
            const toast = document.createElement('div');
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #28a745;
                color: white;
                padding: 15px 25px;
                border-radius: 8px;
                z-index: 99999;
                font-weight: bold;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                animation: slideIn 0.5s ease-out;
            `;
            toast.innerHTML = '✅ Formulario de edición cargado correctamente';
            
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.remove();
                style.remove();
            }, 3000);
            
        }, 100);

        this.state.editando = true;
        console.log('🎉 FORMULARIO DINÁMICO CREADO EXITOSAMENTE');
    }

    // Métodos auxiliares - también con verificación de elementos
    mostrarConfiguracionZonaEdicion() {
        const elemento = document.getElementById('editarConfiguracionZona');
        if (elemento) {
            elemento.style.display = 'block';
        }
    }

    ocultarConfiguracionZonaEdicion() {
        const elemento = document.getElementById('editarConfiguracionZona');
        if (elemento) {
            elemento.style.display = 'none';
        }
        this.ocultarCamposKilometrosEdicion();
    }

    mostrarCamposKilometrosEdicion() {
        const elemento = document.getElementById('editarCampoKilometros');
        if (elemento) {
            elemento.style.display = 'block';
        }
    }

    ocultarCamposKilometrosEdicion() {
        const elemento = document.getElementById('editarCampoKilometros');
        if (elemento) {
            elemento.style.display = 'none';
        }
    }

    // ✅ NUEVO: Función que faltaba - Actualizar vista de edición con productos
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

        // Mostrar cada producto with opción de eliminar
        productos.forEach((producto, index) => {
            const productoDiv = document.createElement('div');
            productoDiv.className = 'producto-edicion';
            productoDiv.style.cssText = `
                border: 1px solid #ddd;
                padding: 10px;
                margin-bottom: 10px;
                border-radius: 5px;
                background-color: #f9f9f9;
            `;

            // Crear descripción del producto
            let descripcion = producto.descripcionCompleta || producto.descripcion || '';
            if (producto.medidas) {
                descripcion += ` - ${producto.medidas}`;
            }

            productoDiv.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>${descripcion}</strong>
                        <br><small>Precio: $${producto.precio.toFixed(2)}</small>
                    </div>
                    <button onclick="app.eliminarProductoEdicion(${index})" 
                            style="background-color: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">
                        Eliminar
                    </button>
                </div>
            `;

            editarListaProductos.appendChild(productoDiv);
        });
    }

    // ✅ NUEVO: Función para eliminar producto en edición
    eliminarProductoEdicion(index) {
        if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            this.productManager.eliminarProducto(index);
            this.actualizarVistaEdicion();
        }
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

    // ✅ NUEVO: Método para actualizar comentarios de productos
    actualizarComentarioProducto(index, valor) {
        const productos = this.productManager.obtenerProductos();
        if (productos[index]) {
            // Actualizar descripción personalizada
            productos[index].descripcionPersonalizada = valor.trim();
            
            // Reconstruir descripción completa
            if (valor.trim()) {
                productos[index].descripcionCompleta = `${productos[index].descripcion} - ${valor.trim()}`;
            } else {
                productos[index].descripcionCompleta = productos[index].descripcion;
            }
            
            console.log(`📝 Comentario actualizado para producto ${index + 1}:`, valor.trim());
            
            // Actualizar vista previa inmediatamente
            this.actualizarVistaPrevia();
            
            // Actualizar tabla de productos
            this.productManager.actualizarTabla();
        }
    }

    // ✅ NUEVO: Configurar flujo paso por paso
    setupPasosPorPasos() {
        const radioConInstalacion = document.getElementById('radioConInstalacion');
        const radioSoloFabricacion = document.getElementById('radioSoloFabricacion');
        const zonaServicio = document.getElementById('zonaServicio');

        // Event listeners para radio buttons de tipo de servicio
        if (radioConInstalacion) {
            radioConInstalacion.addEventListener('change', () => {
                if (radioConInstalacion.checked) {
                    this.configurarConInstalacion();
                }
            });
        }

        if (radioSoloFabricacion) {
            radioSoloFabricacion.addEventListener('change', () => {
                if (radioSoloFabricacion.checked) {
                    this.configurarSoloFabricacion();
                }
            });
        }

        // Event listener para zona (cuando es instalación)
        if (zonaServicio) {
            zonaServicio.addEventListener('change', () => {
                this.handleZonaSoloFabricacion();
            });
        }

        // Event listeners para kilómetros y monto extra
        const kilometros = document.getElementById('kilometros');
        if (kilometros) {
            kilometros.addEventListener('input', () => {
                this.handleViaticosOtroEstado();
                this.handleViaticosChange(); // Mantener lógica existente
            });
        }

        const montoExtra = document.getElementById('montoExtra');
        if (montoExtra) {
            montoExtra.addEventListener('input', () => {
                this.handleViaticosOtroEstado();
                this.handleViaticosChange(); // Mantener lógica existente
            });
        }
    }

    // ✅ CORREGIDO: Configurar cuando SÍ hay instalación
    configurarConInstalacion() {
        console.log('✅ Configurando CON instalación...');
        
        // Marcar checkbox oculto
        document.getElementById('requiereInstalacion').checked = true;
        
        // Mostrar paso 2 para selección de zona
        document.getElementById('configuracionZona').style.display = 'block';
        
        // Limpiar selección previa
        document.getElementById('zonaServicio').value = '';
        
        // Ocultar campos adicionales hasta que se seleccione zona
        document.getElementById('campoKilometros').style.display = 'none';
        document.getElementById('restoFormulario').style.display = 'none';
        
        Helpers.mostrarMensaje('✅ Instalación incluida - Seleccione zona para configurar viáticos', 'info');
    }

    // ✅ CORREGIDO: Configurar cuando NO hay instalación (solo fabricación)
    configurarSoloFabricacion() {
        console.log('📦 Configurando SOLO fabricación...');
        
        // Desmarcar checkbox oculto
        document.getElementById('requiereInstalacion').checked = false;
        
        // Ocultar selección de zona (no es necesaria)
        document.getElementById('configuracionZona').style.display = 'none';
        document.getElementById('campoKilometros').style.display = 'none';
        
        // Limpiar zona
        document.getElementById('zonaServicio').value = '';
        
        // Mostrar directamente el resto del formulario
        document.getElementById('restoFormulario').style.display = 'block';
        
        // Recalcular viáticos (debería limpiarlos)
        if (this.productManager) {
            this.productManager.recalcularViaticos();
        }
        
        Helpers.mostrarMensaje('📦 Solo fabricación configurado - Sin viáticos automáticos', 'success');
    }

    // ✅ CORREGIDO: Manejar selección de zona (solo para instalación)
    handleZonaSoloFabricacion() {
        const zona = document.getElementById('zonaServicio').value;
        console.log('🌍 Zona de instalación seleccionada:', zona);
        
        if (zona === 'otro') {
            // Mostrar campos de kilómetros para otros estados
            document.getElementById('campoKilometros').style.display = 'block';
            document.getElementById('restoFormulario').style.display = 'none'; // Esperar configuración de km
            Helpers.mostrarMensaje('🗺️ Otro estado - Configure distancia y viáticos adicionales', 'info');
        } else if (zona === 'cdmx') {
            // CDMX: viáticos fijos, mostrar resto del formulario
            document.getElementById('campoKilometros').style.display = 'none';
            document.getElementById('restoFormulario').style.display = 'block';
            Helpers.mostrarMensaje('🏙️ CDMX - Viáticos fijos de $1,000 aplicados', 'success');
        }
        
        // Recalcular viáticos según nueva configuración
        if (this.productManager && zona) {
            this.productManager.recalcularViaticos();
        }
    }

    // ✅ NUEVO: Event listener para cuando se configuran km en otros estados
    handleViaticosOtroEstado() {
        const km = document.getElementById('kilometros').value;
        const extra = document.getElementById('montoExtra').value;
        
        // Si se configuró al menos kilómetros, mostrar resto del formulario
        if (km && km > 0) {
            document.getElementById('restoFormulario').style.display = 'block';
            
            // Recalcular viáticos
            if (this.productManager) {
                this.productManager.recalcularViaticos();
            }
            
            let mensaje = `🗺️ Viáticos configurados: ${km}km`;
            if (extra && extra > 0) {
                mensaje += ` + $${extra} extra`;
            }
            Helpers.mostrarMensaje(mensaje, 'success');
        }
    }

    // Guardar edición
    guardarEdicion() {
        const cliente = document.getElementById('editarCliente').value;
        if (!cliente) {
            alert("Ingrese el nombre del cliente");
            return;
        }

        // ✅ CORREGIDO: Capturar todos los campos nuevos
        const requiereInstalacion = document.getElementById('editarRadioConInstalacion').checked;
        
        // Configuración de zona y viáticos
        let zonaServicio = '';
        let kilometros = 0;
        let montoExtra = 0;
        let tipoViatico = 'implicito';

        if (requiereInstalacion) {
            zonaServicio = document.getElementById('editarZonaServicio').value;
            
            if (zonaServicio === 'otro') {
                kilometros = parseFloat(document.getElementById('editarKilometros').value) || 0;
                montoExtra = parseFloat(document.getElementById('editarMontoExtra').value) || 0;
                tipoViatico = document.querySelector('input[name="editarTipoViatico"]:checked').value;
            }
        }

        // Actualizar estado de cotización
        this.state.cotizacion = {
            cliente: cliente,
            fecha: new Date().toLocaleDateString(),
            productos: [...this.productManager.obtenerProductos()],
            especificaciones: document.getElementById('editarEspecificaciones').value,
            // ✅ CORREGIDO: Usar los IDs correctos
            requiereFactura: document.getElementById('editarRequiereFactura').checked,
            requiereInstalacion: requiereInstalacion,
            // ✅ NUEVO: Incluir configuración de zona y viáticos
            zonaServicio: zonaServicio,
            kilometros: kilometros,
            montoExtra: montoExtra,
            tipoViatico: tipoViatico
        };

        // Actualizar vista previa final
        this.actualizarVistaPrevia();
        
        // ✅ CORREGIDO: Restaurar correctamente todos los elementos
        const editarForm = document.getElementById('editarForm');
        const vistaPrevia = document.getElementById('vistaPrevia');
        const buttonGroup = document.querySelector('.button-group');
        const mensajes = document.getElementById('mensajes');
        
        // Ocultar formulario de edición
        if (editarForm) {
            editarForm.style.display = 'none';
        }
        
        // Mostrar vista previa
        if (vistaPrevia) {
            vistaPrevia.style.display = 'block';
        }
        
        // Mostrar botones principales
        if (buttonGroup) {
            buttonGroup.style.display = 'flex';
        }
        
        // Mostrar mensajes si había contenido
        if (mensajes && mensajes.innerHTML.trim()) {
            mensajes.style.display = 'block';
        }
        
        // ✅ QUITAR clase CSS del body
        document.body.classList.remove('editing-mode');
        document.body.classList.remove('editing');
        
        // ✅ RESTAURAR elementos principales
        const cotizacionForm = document.getElementById('cotizacionForm');
        const vistaPreviaRestore = document.getElementById('vistaPrevia');
        const buttonGroupRestore = document.querySelector('.button-group');
        const mensajesRestore = document.getElementById('mensajes');
        
        // Limpiar estilos inline agresivos
        if (cotizacionForm) {
            cotizacionForm.style.cssText = '';
        }
        if (vistaPreviaRestore) {
            vistaPreviaRestore.style.display = 'block';
        }
        if (buttonGroupRestore) {
            buttonGroupRestore.style.cssText = '';
        }
        if (mensajesRestore && mensajesRestore.innerHTML.trim()) {
            mensajesRestore.style.cssText = '';
        }
        
        this.state.editando = false;
        
        alert("Cambios guardados correctamente");
    }

    // Cerrar edición sin guardar cambios
    cerrarEdicion() {
        // Restaurar vista previa
        const editarForm = document.getElementById('editarForm');
        const vistaPrevia = document.getElementById('vistaPrevia');
        const buttonGroup = document.querySelector('.button-group');
        const mensajes = document.getElementById('mensajes');
        
        // Ocultar formulario de edición
        if (editarForm) {
            editarForm.style.display = 'none';
        }
        
        // Mostrar vista previa
        if (vistaPrevia) {
            vistaPrevia.style.display = 'block';
        }
        
        // Mostrar botones principales
        if (buttonGroup) {
            buttonGroup.style.display = 'flex';
        }
        
        // Mostrar mensajes si había contenido
        if (mensajes && mensajes.innerHTML.trim()) {
            mensajes.style.display = 'block';
        }
        
        // ✅ QUITAR clase CSS del body
        document.body.classList.remove('editing-mode');
        document.body.classList.remove('editing');
        
        // ✅ RESTAURAR elementos principales
        const cotizacionForm = document.getElementById('cotizacionForm');
        const vistaPreviaRestore = document.getElementById('vistaPrevia');
        const buttonGroupRestore = document.querySelector('.button-group');
        const mensajesRestore = document.getElementById('mensajes');
        
        // Limpiar estilos inline agresivos
        if (cotizacionForm) {
            cotizacionForm.style.cssText = '';
        }
        if (vistaPreviaRestore) {
            vistaPreviaRestore.style.display = 'block';
        }
        if (buttonGroupRestore) {
            buttonGroupRestore.style.cssText = '';
        }
        if (mensajesRestore && mensajesRestore.innerHTML.trim()) {
            mensajesRestore.style.cssText = '';
        }
        
        this.state.editando = false;
    }

    // ✅ NUEVO: Configurar event listeners específicos para edición
    configurarEventListenersEdicion() {
        // Verificar que los elementos existan antes de agregar event listeners
        const editarRadioConInstalacion = document.getElementById('editarRadioConInstalacion');
        const editarRadioSoloFabricacion = document.getElementById('editarRadioSoloFabricacion');
        const editarZonaServicio = document.getElementById('editarZonaServicio');
        
        if (editarRadioConInstalacion) {
            // Remover event listeners anteriores si existen
            editarRadioConInstalacion.removeEventListener('change', this.handleConInstalacionEdicion);
            // Agregar nuevo event listener
            this.handleConInstalacionEdicion = () => {
                if (editarRadioConInstalacion.checked) {
                    this.mostrarConfiguracionZonaEdicion();
                    const editarRequiereInstalacion = document.getElementById('editarRequiereInstalacion');
                    if (editarRequiereInstalacion) {
                        editarRequiereInstalacion.checked = true;
                    }
                }
            };
            editarRadioConInstalacion.addEventListener('change', this.handleConInstalacionEdicion);
        }

        if (editarRadioSoloFabricacion) {
            // Remover event listeners anteriores si existen
            editarRadioSoloFabricacion.removeEventListener('change', this.handleSoloFabricacionEdicion);
            // Agregar nuevo event listener
            this.handleSoloFabricacionEdicion = () => {
                if (editarRadioSoloFabricacion.checked) {
                    this.ocultarConfiguracionZonaEdicion();
                    const editarRequiereInstalacion = document.getElementById('editarRequiereInstalacion');
                    if (editarRequiereInstalacion) {
                        editarRequiereInstalacion.checked = false;
                    }
                }
            };
            editarRadioSoloFabricacion.addEventListener('change', this.handleSoloFabricacionEdicion);
        }

        if (editarZonaServicio) {
            // Remover event listeners anteriores si existen
            editarZonaServicio.removeEventListener('change', this.handleZonaServicioEdicion);
            // Agregar nuevo event listener
            this.handleZonaServicioEdicion = (e) => {
                if (e.target.value === 'otro') {
                    this.mostrarCamposKilometrosEdicion();
                } else {
                    this.ocultarCamposKilometrosEdicion();
                }
            };
            editarZonaServicio.addEventListener('change', this.handleZonaServicioEdicion);
        }

        console.log('✅ Event listeners de edición configurados');
    }

    // ✅ NUEVO: Configurar visibilidad inicial del formulario de edición
    configurarVisibilidadInicialEdicion() {
        // Obtener estado actual
        const requiereInstalacion = this.state.cotizacion?.requiereInstalacion || false;
        const zonaServicio = this.state.cotizacion?.zonaServicio || '';

        console.log('Configurando visibilidad inicial:', { requiereInstalacion, zonaServicio });

        // Configurar visibilidad de secciones según el estado
        if (requiereInstalacion) {
            this.mostrarConfiguracionZonaEdicion();
            if (zonaServicio === 'otro') {
                this.mostrarCamposKilometrosEdicion();
            } else {
                this.ocultarCamposKilometrosEdicion();
            }
        } else {
            this.ocultarConfiguracionZonaEdicion();
        }

        // Remover el contenido debug si existe
        setTimeout(() => {
            const debugContent = document.getElementById('debug-content');
            if (debugContent) {
                debugContent.remove();
            }
        }, 1000);
    }

    // ✅ NUEVO: Cargar productos en la lista dinámica
    cargarProductosEnListaDinamica() {
        const lista = document.getElementById('editarListaProductosDinamica');
        if (!lista) return;

        const productos = this.productManager.obtenerProductos();
        
        if (productos.length === 0) {
            lista.innerHTML = '<p style="text-align: center; color: #666; margin: 20px 0;">No hay productos para editar</p>';
            return;
        }

        lista.innerHTML = '';
        
        productos.forEach((producto, index) => {
            const productoDiv = document.createElement('div');
            productoDiv.style.cssText = `
                border: 1px solid #ddd;
                padding: 15px;
                margin-bottom: 10px;
                border-radius: 8px;
                background: white;
                display: flex;
                justify-content: space-between;
                align-items: center;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            `;

            let descripcion = producto.descripcionCompleta || producto.descripcion || '';
            if (producto.medidas) {
                descripcion += ` - ${producto.medidas}`;
            }

            productoDiv.innerHTML = `
                <div>
                    <strong style="font-size: 16px; color: #333;">${descripcion}</strong>
                    <br><span style="color: #28a745; font-weight: bold; font-size: 15px;">Precio: $${Helpers.formatearNumero(producto.precio)}</span>
                    ${producto.descripcionPersonalizada ? `<br><small style="color: #666; font-style: italic;">${producto.descripcionPersonalizada}</small>` : ''}
                </div>
                <div>
                    <button onclick="app.eliminarProductoEdicionDinamica(${index})" style="background-color: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">
                        Eliminar
                    </button>
                    <button onclick="window.editarProductoDinamico(${index})" style="margin-left:8px;background:#ffc107;color:#333;border:none;padding:8px 15px;border-radius:5px;cursor:pointer;font-weight:bold;">✏️ Editar</button>
                </div>
            `;

            lista.appendChild(productoDiv);
        });
    }

    // ✅ NUEVO: Configurar event listeners para formulario dinámico
    configurarEventListenersEdicionDinamica() {
        const radioConInstalacion = document.getElementById('editarRadioConInstalacionDinamico');
        const radioSoloFabricacion = document.getElementById('editarRadioSoloFabricacionDinamico');
        const zonaServicio = document.getElementById('editarZonaServicioDinamico');

        if (radioConInstalacion) {
            radioConInstalacion.addEventListener('change', () => {
                if (radioConInstalacion.checked) {
                    document.getElementById('editarConfiguracionZonaDinamico').style.display = 'block';
                    console.log('✅ Instalación activada');
                }
            });
        }

        if (radioSoloFabricacion) {
            radioSoloFabricacion.addEventListener('change', () => {
                if (radioSoloFabricacion.checked) {
                    document.getElementById('editarConfiguracionZonaDinamico').style.display = 'none';
                    console.log('📦 Solo fabricación activado');
                }
            });
        }

        if (zonaServicio) {
            zonaServicio.addEventListener('change', (e) => {
                const campoKm = document.getElementById('editarCampoKilometrosDinamico');
                if (e.target.value === 'otro') {
                    campoKm.style.display = 'block';
                    console.log('🗺️ Otros estados - campos de kilómetros mostrados');
                } else {
                    campoKm.style.display = 'none';
                    console.log('🏙️ CDMX seleccionado - campos de kilómetros ocultos');
                }
            });
        }

        console.log('✅ Event listeners dinámicos configurados');
    }

    // ✅ NUEVO: Guardar edición desde formulario dinámico
    guardarEdicionDinamica() {
        const cliente = document.getElementById('editarClienteDinamico').value.trim();
        if (!cliente) {
            alert("Ingrese el nombre del cliente");
            return;
        }

        // Obtener datos del formulario dinámico
        const requiereInstalacion = document.getElementById('editarRadioConInstalacionDinamico').checked;
        const requiereFactura = document.getElementById('editarRequiereFacturaDinamico')?.checked || false;
        const especificaciones = document.getElementById('editarEspecificacionesDinamico').value;
        
        let zonaServicio = '';
        let kilometros = 0;
        let montoExtra = 0;
        let tipoViatico = 'implicito';

        if (requiereInstalacion) {
            zonaServicio = document.getElementById('editarZonaServicioDinamico').value;
            
            if (zonaServicio === 'otro') {
                kilometros = parseFloat(document.getElementById('editarKilometrosDinamico').value) || 0;
                montoExtra = parseFloat(document.getElementById('editarMontoExtraDinamico').value) || 0;
                const radioTipoViatico = document.querySelector('input[name="editarTipoViatico"]:checked');
                tipoViatico = radioTipoViatico ? radioTipoViatico.value : 'implicito';
            }
        }

        // Actualizar cotización
        this.state.cotizacion = {
            cliente: cliente,
            fecha: new Date().toLocaleDateString(),
            productos: [...this.productManager.obtenerProductos()],
            especificaciones: especificaciones,
            requiereFactura: requiereFactura,
            requiereInstalacion: requiereInstalacion,
            zonaServicio: zonaServicio,
            kilometros: kilometros,
            montoExtra: montoExtra,
            tipoViatico: tipoViatico
        };

        // Actualizar vista previa
        this.actualizarVistaPrevia();
        
        // Cerrar formulario dinámico
        this.cerrarEdicionDinamica();
        
        console.log('✅ Edición guardada:', this.state.cotizacion);
        alert("✅ Cambios guardados correctamente");
    }

    // ✅ NUEVO: Cerrar formulario dinámico
    cerrarEdicionDinamica() {
        const formularioDinamico = document.getElementById('editarFormDinamico');
        if (formularioDinamico) {
            formularioDinamico.remove();
        }

        // Remover clase del body
        document.body.classList.remove('editing-mode');

        // Mostrar elementos principales
        const elementosAMostrar = [
            '#vistaPrevia', 
            '.button-group',
            '#mensajes'
        ];
        
        elementosAMostrar.forEach(selector => {
            const elemento = document.querySelector(selector);
            if (elemento) {
                elemento.style.display = '';
            }
        });

        this.state.editando = false;
        console.log('✅ Formulario dinámico cerrado');
    }

    // ✅ NUEVO: Eliminar producto en edición dinámica
    eliminarProductoEdicionDinamica(index) {
        if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            this.productManager.eliminarProducto(index);
            this.cargarProductosEnListaDinamica();
            console.log(`✅ Producto ${index + 1} eliminado`);
        }
    }

    // NUEVO: Función para editar producto dinámico
    editarProductoDinamico(index) {
        const producto = window.app.productManager.productos[index];
        if (!producto) return;

        // Mostrar el formulario de edición
        document.getElementById('editarForm').style.display = 'block';
        document.getElementById('formularioNuevoProducto').style.display = 'block';

        // Rellenar los campos del formulario de edición
        const categoria = document.getElementById('categoriaProductoEdicion');
        if (categoria) categoria.value = producto.categoria || '';

        const tipo = document.getElementById('tipoProductoEdicion');
        if (tipo) tipo.value = producto.tipo || '';

        const base = document.getElementById('baseEdicion');
        if (base) base.value = producto.base || '';

        const altura = document.getElementById('alturaEdicion');
        if (altura) altura.value = producto.altura || '';

        const tipoNeon = document.getElementById('tipoNeonEdit');
        if (tipoNeon) tipoNeon.value = producto.tipoNeon || '';

        const calidadLona = document.getElementById('calidadLonaEditar');
        if (calidadLona) calidadLona.value = producto.calidadLona || '';

        const calidadVinil = document.getElementById('calidadVinilEdit');
        if (calidadVinil) calidadVinil.value = producto.calidadVinil || '';

        const altura3D = document.getElementById('altura3DEdicion');
        if (altura3D) altura3D.value = producto.altura3D || '';

        const material3D = document.getElementById('material3DEdicion');
        if (material3D) material3D.value = producto.material3D || '';

        const base3D = document.getElementById('base3DEdicion');
        if (base3D) base3D.value = producto.base3D || '';

        const alturaInfo3D = document.getElementById('alturaInfo3DEdicion');
        if (alturaInfo3D) alturaInfo3D.value = producto.alturaInfo3D || '';

        const alturaPlanas = document.getElementById('alturaPlanasEdicion');
        if (alturaPlanas) alturaPlanas.value = producto.alturaPlanas || '';

        const materialPlanas = document.getElementById('materialPlanasEdicion');
        if (materialPlanas) materialPlanas.value = producto.materialPlanas || '';

        const basePlanas = document.getElementById('basePlanasEdicion');
        if (basePlanas) basePlanas.value = producto.basePlanas || '';

        const alturaInfoPlanas = document.getElementById('alturaInfoPlanasEdicion');
        if (alturaInfoPlanas) alturaInfoPlanas.value = producto.alturaInfoPlanas || '';

        const calidadBanner = document.getElementById('calidadBannerEdicion');
        if (calidadBanner) calidadBanner.value = producto.calidadBanner || '';

        const areaCircular = document.getElementById('areaCircularEdicion');
        if (areaCircular) areaCircular.value = producto.areaCircular || '';

        const descripcionOtro = document.getElementById('descripcionOtroEdit');
        if (descripcionOtro) descripcionOtro.value = producto.descripcionOtro || '';

        const costoOtro = document.getElementById('costoOtroEdit');
        if (costoOtro) costoOtro.value = producto.costo || '';

        const baseDobleVista = document.getElementById('baseDobleVistaEditar');
        if (baseDobleVista) baseDobleVista.value = producto.baseDobleVista || '';

        const alturaDobleVista = document.getElementById('alturaDobleVistaEditar');
        if (alturaDobleVista) alturaDobleVista.value = producto.alturaDobleVista || '';

        const descripcionPersonalizada = document.getElementById('descripcionPersonalizadaEdicion');
        if (descripcionPersonalizada) descripcionPersonalizada.value = producto.descripcionPersonalizada || '';
    }
}

// Exponer la clase CotizacionApp globalmente
window.CotizacionApp = CotizacionApp;

document.addEventListener('DOMContentLoaded', function() {
    let app = new CotizacionApp();
    window.app = app;

    // Forzar recálculo de viáticos al inicio (si hay productos)
    setTimeout(() => {
        if (app.productManager.productos.length > 0) {
            app.productManager.productos.forEach((producto, index) => {
                producto.precioBase = producto.precio;
            });
            app.productManager.recalcularViaticos();
        }
    }, 1000);

    // Función para crear productos dinámicamente
    window.agregarProductoDinamico = function() {
        const categoria = document.getElementById('categoriaProductoDinamico').value;
        const tipo = document.getElementById('tipoProductoDinamico').value || (categoria === 'neon' ? '3' : '');
        const descripcionPersonalizada = document.getElementById('descripcionPersonalizadaDinamico').value;

        if (!categoria) {
            alert('Por favor seleccione una categoría');
            return;
        }
        if (!tipo && categoria !== 'neon') {
            alert('Por favor seleccione un tipo de producto');
            return;
        }

        const campos = {};
        const camposIds = [
            'baseDinamico', 'alturaDinamico', 'tipoNeonDinamico', 'calidadLonaDinamico', 'calidadVinilDinamico',
            'altura3DDinamico', 'material3DDinamico', 'base3DDinamico', 'alturaInfo3DDinamico',
            'alturaplanasDinamico', 'materialPlanasDinamico', 'basePlanasDinamico', 'alturaInfoPlanasDinamico',
            'calidadBannerDinamico', 'areaCircularDinamico', 'descripcionOtroDinamico', 'costoOtroDinamico',
            'baseDobleVistaDinamico', 'alturaDobleVistaDinamico'
        ];
        camposIds.forEach(id => {
            const el = document.getElementById(id);
            if (el && el.value) campos[id.replace('Dinamico', '')] = el.value;
        });

        let nombreTipo = '';
        if (window.categoriasDinamicas && window.categoriasDinamicas[categoria]) {
            const tipoObj = window.categoriasDinamicas[categoria].find(t => t.value === tipo);
            if (tipoObj) nombreTipo = tipoObj.text;
        }

        if (window.app && window.app.productManager) {
            const producto = window.app.productManager.crearProducto(tipo, nombreTipo, campos, descripcionPersonalizada);
            if (producto) {
                window.app.productManager.agregarProducto(producto);
                if (typeof window.app.cargarProductosEnListaDinamica === 'function') {
                    window.app.cargarProductosEnListaDinamica();
                }
                alert('✅ Producto agregado exitosamente');
                window.toggleFormularioNuevoProducto();
            } else {
                alert('No se pudo crear el producto');
            }
        } else {
            alert('Error: ProductManager no disponible');
        }

        if (window.productoEditandoIndex !== null) {
            const producto = window.app.productManager.productos[window.productoEditandoIndex];
            if (producto) {
                const nuevoCosto = document.getElementById('costoOtroEdit')?.value;
                if (nuevoCosto !== undefined && producto) {
                    producto.costo = parseFloat(nuevoCosto) || 0;
                }
                window.app.cargarProductosEnListaDinamica();
                window.toggleFormularioNuevoProducto();
                window.productoEditandoIndex = null;
                document.querySelector('#formularioNuevoProductoDinamico button[type="button"]').textContent = '✅ Agregar Producto';
                return;
            }
        }
    };

    window.editarProductoDinamico = function(index) {
        console.log('+++++++ Editando producto en índice:', index);
        // 1. Verifica el producto
    const producto = window.app.productManager.productos[index];
    console.log('Producto seleccionado:', producto);
    if (!producto) {
        console.error('No se encontró el producto en el índice:', index);
        return;
    }

         // 2. Mostrar el formulario de edición
    const editarForm = document.getElementById('editarForm');
    const formularioNuevoProducto = document.getElementById('formularioNuevoProducto');
    console.log('editarForm:', editarForm);
    console.log('formularioNuevoProducto:', formularioNuevoProducto);

    if (editarForm) editarForm.style.display = 'block';
    if (formularioNuevoProducto) formularioNuevoProducto.style.display = 'block';


        // 3. Debug de cada campo
    const campos = [
        ['categoriaProductoEdicion', 'categoria'],
        ['tipoProductoEdicion', 'tipo'],
        ['baseEdicion', 'base'],
        ['alturaEdicion', 'altura'],
        ['tipoNeonEdit', 'tipoNeon'],
        ['calidadLonaEditar', 'calidadLona'],
        ['calidadVinilEdit', 'calidadVinil'],
        ['altura3DEdicion', 'altura3D'],
        ['material3DEdicion', 'material3D'],
        ['base3DEdicion', 'base3D'],
        ['alturaInfo3DEdicion', 'alturaInfo3D'],
        ['alturaPlanasEdicion', 'alturaPlanas'],
        ['materialPlanasEdicion', 'materialPlanas'],
        ['basePlanasEdicion', 'basePlanas'],
        ['alturaInfoPlanasEdicion', 'alturaInfoPlanas'],
        ['calidadBannerEdicion', 'calidadBanner'],
        ['areaCircularEdicion', 'areaCircular'],
        ['descripcionOtroEdit', 'descripcionOtro'],
        ['costoOtroEdit', 'costo'],
        ['baseDobleVistaEditar', 'baseDobleVista'],
        ['alturaDobleVistaEditar', 'alturaDobleVista'],
        ['descripcionPersonalizadaEdicion', 'descripcionPersonalizada']
    ];

    campos.forEach(([id, prop]) => {
        const campo = document.getElementById(id);
        const valor = producto[prop] || '';
        console.log(`Campo: ${id}, Elemento:`, campo, `Valor producto.${prop}:`, valor);
        if (campo) campo.value = valor;
    });
    }
});