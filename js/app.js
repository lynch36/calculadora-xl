// Crear un gestor de estado centralizado
const CotizacionManager = {
    state: {
        cotizacion: null,
        productosArray: [],
        editando: false
    },

    // Inicializar la aplicación
    init() {
        this.setupEventListeners();
        this.resetState();
    },

    // Configurar todos los event listeners
    setupEventListeners() {
        // Event listener para el tipo de producto principal
        document.getElementById('tipoProducto').addEventListener('change', (e) => {
            this.mostrarCamposEspecificos(e.target.value, false);
        });

        // Event listener para el tipo de producto en edición
        document.getElementById('tipoProductoEdicion').addEventListener('change', (e) => {
            this.mostrarCamposEspecificos(e.target.value, true);
        });

        // Event listeners para checkboxes
        ['requiereFactura', 'requiereInstalacion', 'editarFactura', 'editarInstalacion'].forEach(id => {
            document.getElementById(id)?.addEventListener('change', () => this.actualizarVistaPrevia());
        });
    },

    // Resetear el estado
    resetState() {
        this.state = {
            cotizacion: null,
            productosArray: [],
            editando: false
        };
        this.actualizarVistas();
    },

    // Mostrar/ocultar campos específicos
    mostrarCamposEspecificos(tipo, esEdicion) {
        const suffix = esEdicion ? 'Edit' : '';
        const campos = {
            medidas: ['1', '2', '3', '4', '5', '8'],
            opcionesNeon: ['3'],
            opcionesLona: ['4'],
            opcionesVinil: ['5'],
            opcionesLetras3D: ['6'],
            opcionesLetrasPlanas: ['7'],
            opcionesBanner: ['8'],
            opcionesCircular: ['9'],
            otroProducto: ['10']
        };

        // Ocultar todos los campos
        Object.keys(campos).forEach(campo => {
            const elemento = document.getElementById(campo + suffix);
            if (elemento) elemento.style.display = 'none';
        });

        // Mostrar campos relevantes
        Object.entries(campos).forEach(([campo, tipos]) => {
            if (tipos.includes(tipo)) {
                const elemento = document.getElementById(campo + suffix);
                if (elemento) elemento.style.display = 'block';
            }
        });
    },

    // Agregar producto
    agregarProducto(esEdicion = false) {
        const tipo = document.getElementById('tipoProducto').value;
        if (!tipo) {
            this.mostrarMensaje("Seleccione un tipo de producto", "error");
            return;
        }

        const nuevoProducto = this.crearProducto(tipo, '');
        if (nuevoProducto) {
            this.state.productosArray.push(nuevoProducto);
            this.actualizarVistaProductos();
            
            // Limpiar campos después de agregar
            document.getElementById('tipoProducto').value = '';
            document.getElementById('base').value = '';
            document.getElementById('altura').value = '';
            document.getElementById('altura3D').value = '';
            document.getElementById('alturaPlanas').value = '';
            document.getElementById('areaCircular').value = '';
            document.getElementById('descripcionOtro').value = '';
            document.getElementById('costoOtro').value = '';

            // Ocultar todos los campos específicos
            const camposEspecificos = [
                'medidas',
                'opcionesNeon',
                'opcionesLona',
                'opcionesVinil',
                'opcionesLetras3D',
                'opcionesLetrasPlanas',
                'opcionesBanner',
                'opcionesCircular',
                'otroProducto'
            ];
            
            camposEspecificos.forEach(id => {
                const elemento = document.getElementById(id);
                if (elemento) elemento.style.display = 'none';
            });

            this.mostrarMensaje("Producto agregado correctamente", "success");
        }
    },

    eliminarProducto(index) {
        this.state.productosArray.splice(index, 1);
        // Actualizar ambas vistas
        this.actualizarVistaProductos();
        this.actualizarVistaEdicion();
        this.actualizarVistaPrevia();
        this.mostrarMensaje("Producto eliminado", "success");
    },

    // Crear producto según tipo
    crearProducto(tipo, suffix = '') {
        // Corregir cómo se obtienen los valores con el sufijo
        const base = parseFloat(document.getElementById(`base${suffix}`)?.value);
        const altura = parseFloat(document.getElementById(`altura${suffix}`)?.value);
        const areaCircular = parseFloat(document.getElementById(`areaCircular${suffix === 'Edicion' ? 'Edit' : ''}`)?.value);
        
        let producto = {
            tipo: tipo,
            descripcion: '',
            precio: 0,
            medidas: ''
        };

        switch (tipo) {
            case "1": // Caja de Acrílico
                if (!base || !altura) {
                    this.mostrarMensaje("Ingrese las medidas", "error");
                    return null;
                }
                producto.descripcion = "Caja de Acrílico";
                producto.precio = this.sumaArea(base, altura, 18);
                producto.medidas = `${base}cm x ${altura}cm`;
                break;

            case "2": // Caja de Lona
                if (!base || !altura) {
                    this.mostrarMensaje("Ingrese las medidas", "error");
                    return null;
                }
                producto.descripcion = "Caja de Lona";
                producto.precio = this.sumaArea(base, altura, 15);
                producto.medidas = `${base}cm x ${altura}cm`;
                break;

            case "3": // Neón
                if (!base || !altura) {
                    this.mostrarMensaje("Ingrese las medidas", "error");
                    return null;
                }
                // Corregir cómo obtenemos el tipo de neón
                const tipoNeon = document.getElementById(suffix === 'Edicion' ? 'tipoNeonEdit' : 'tipoNeon')?.value;
                console.log('Tipo Neón:', {
                    tipoNeon,
                    suffix,
                    id: suffix === 'Edicion' ? 'tipoNeonEdit' : 'tipoNeon'
                });
                
                if (!tipoNeon) {
                    this.mostrarMensaje("Seleccione el tipo de neón", "error");
                    return null;
                }
                producto.descripcion = `Neón ${tipoNeon === "1" ? "Normal" : "2.0"}`;
                producto.precio = this.sumaArea(base, altura, tipoNeon === "1" ? 18 : 25);
                producto.medidas = `${base}cm x ${altura}cm`;
                break;

            case "4": // Impresión Lona
                if (!base || !altura) {
                    this.mostrarMensaje("Ingrese las medidas", "error");
                    return null;
                }
                const calidadLona = document.getElementById(`calidadLona${suffix === 'Edicion' ? 'Edit' : ''}`)?.value;
                if (!calidadLona) {
                    this.mostrarMensaje("Seleccione la calidad de lona", "error");
                    return null;
                }
                const preciosLona = {1: 110, 2: 250, 3: 340};
                producto.descripcion = `Impresión Lona ${["720", "Alta", "UV"][parseInt(calidadLona)-1]}`;
                producto.precio = this.multiplicacionArea(base, altura, preciosLona[calidadLona]);
                producto.medidas = `${base}cm x ${altura}cm`;
                break;

            case "5": // Impresión Vinil
                if (!base || !altura) {
                    this.mostrarMensaje("Ingrese las medidas", "error");
                    return null;
                }
                const calidadVinil = document.getElementById(suffix === 'Edicion' ? 'calidadVinilEdit' : 'calidadVinil')?.value;
                if (!calidadVinil) {
                    this.mostrarMensaje("Seleccione la calidad del vinil", "error");
                    return null;
                }
                const preciosVinil = {1: 224, 2: 340, 3: 460, 4: 640};
                producto.descripcion = `Impresión Vinil ${["720", "Alta", "UV", "UV 3M"][parseInt(calidadVinil)-1]}`;
                producto.precio = this.multiplicacionArea(base, altura, preciosVinil[calidadVinil]);
                producto.medidas = `${base}cm x ${altura}cm`;
                break;

            case "6": // Letras 3D
                const altura3D = parseFloat(document.getElementById(suffix === 'Edicion' ? 'altura3DEdit' : 'altura3D')?.value);
                const material3D = document.getElementById(suffix === 'Edicion' ? 'material3DEdit' : 'material3D')?.value;
                
                console.log('Valores Letras 3D:', {
                    altura3D,
                    material3D,
                    suffix,
                    idAltura: suffix === 'Edicion' ? 'altura3DEdit' : 'altura3D',
                    idMaterial: suffix === 'Edicion' ? 'material3DEdit' : 'material3D'
                });

                if (!altura3D) {
                    this.mostrarMensaje("Ingrese la altura", "error");
                    return null;
                }
                if (!material3D) {
                    this.mostrarMensaje("Seleccione el material", "error");
                    return null;
                }

                const precios3D = {1: 35, 2: 25, 3: 30, 4: 20};
                producto.descripcion = `Letras 3D ${["Acrílico con luz", "Aluminio con luz", "Acrílico sin luz", "Aluminio sin luz"][parseInt(material3D)-1]}`;
                producto.precio = this.sumaAltura(altura3D, precios3D[material3D]);
                producto.medidas = `${altura3D}cm de altura`;
                break;

            case "7": // Letras Planas
                const alturaPlanas = parseFloat(document.getElementById(suffix === 'Edicion' ? 'alturaPlanasEdit' : 'alturaPlanas')?.value);
                const materialPlanas = document.getElementById(suffix === 'Edicion' ? 'materialPlanasEdit' : 'materialPlanas')?.value;
                
                if (!alturaPlanas) {
                    this.mostrarMensaje("Ingrese la altura", "error");
                    return null;
                }
                if (!materialPlanas) {
                    this.mostrarMensaje("Seleccione el material", "error");
                    return null;
                }
                
                const preciosPlanas = {1: 18, 2: 12};
                producto.descripcion = `Letras Planas ${["Acrílico", "Aluminio"][parseInt(materialPlanas)-1]}`;
                producto.precio = this.sumaAltura(alturaPlanas, preciosPlanas[materialPlanas]);
                producto.medidas = `${alturaPlanas}cm de altura`;
                break;

            case "8": // Banner Lona
                if (!base || !altura) {
                    this.mostrarMensaje("Ingrese las medidas", "error");
                    return null;
                }
                const calidadBanner = document.getElementById(suffix === 'Edicion' ? 'calidadBannerEdit' : 'calidadBanner')?.value;
                if (!calidadBanner) {
                    this.mostrarMensaje("Seleccione la calidad del banner", "error");
                    return null;
                }
                const preciosBanner = {1: 800, 2: 900};
                producto.descripcion = `Banner Lona ${["720", "Alta"][parseInt(calidadBanner)-1]}`;
                producto.precio = this.multiplicacionArea(base, altura, preciosBanner[calidadBanner]);
                producto.medidas = `${base}cm x ${altura}cm`;
                break;

            case "9": // Caja Circular
                if (!areaCircular) {
                    this.mostrarMensaje("Ingrese el área", "error");
                    return null;
                }
                producto.descripcion = "Caja Circular";
                producto.precio = areaCircular * 45;
                producto.medidas = `${areaCircular}cm²`;
                break;

            case "10": // Otro
                const otroSuffix = suffix === 'Edicion' ? 'Edit' : '';
                const descripcionOtro = document.getElementById(`descripcionOtro${otroSuffix}`)?.value;
                const costoOtro = parseFloat(document.getElementById(`costoOtro${otroSuffix}`)?.value);
                
                console.log('Valores Otro:', {
                    descripcionOtro,
                    costoOtro,
                    suffix,
                    idDescripcion: `descripcionOtro${otroSuffix}`,
                    idCosto: `costoOtro${otroSuffix}`
                });

                if (!descripcionOtro || isNaN(costoOtro)) {
                    this.mostrarMensaje("Complete la descripción y el costo", "error");
                    return null;
                }
                producto.descripcion = descripcionOtro;
                producto.precio = costoOtro;
                break;
        }
        return producto;
    },

    multiplicacionArea(base, altura, precio) {
        return parseFloat(((base * altura) * (precio / 10000)).toFixed(2));
    },

    sumaAltura(altura, precio) {
        return altura * precio;
    },

    sumaArea(base, altura, precio) {
        return (base + altura) * precio;
    },

    // Mostrar formulario
    mostrarFormulario() {
        if (this.state.cotizacion) {
            // Si ya existe una cotización, mostrar confirmación
            if (confirm('¿Estás seguro de que deseas crear una nueva cotización? Los datos no guardados se perderán.')) {
                this.resetearFormulario();
            }
        } else {
            // Si no hay cotización previa, simplemente mostrar el formulario
            this.resetearFormulario();
        }
    },

    // Agregar esta nueva función auxiliar
resetearFormulario() {
    document.getElementById('cotizacionForm').style.display = 'block';
    document.getElementById('vistaPrevia').style.display = 'none';
    document.getElementById('editarForm').style.display = 'none';
    document.getElementById('clienteNombre').value = '';
    document.getElementById('requiereFactura').checked = false;
    document.getElementById('requiereInstalacion').checked = false;
    document.getElementById('listaProductos').innerHTML = '';
    this.resetState();
},

    // Actualizar descripción de producto
    actualizarDescripcionProducto(index, valor) {
        if (this.state.productosArray[index]) {
            this.state.productosArray[index].descripcion = valor;
            this.actualizarVistaPrevia();
            this.mostrarMensaje("Descripción actualizada", "success");
        }
    },

    // Actualizar precio de producto
    actualizarPrecioProducto(index, valor) {
        if (this.state.productosArray[index]) {
            this.state.productosArray[index].precio = parseFloat(valor);
            this.actualizarVistaPrevia();
            this.mostrarMensaje("Precio actualizado", "success");
        }
    },

    // Editar cotización
    editarCotizacion() {
        if (this.state.productosArray.length === 0) {
            this.mostrarMensaje("No hay productos para editar.", "error");
            return;
        }

        // Mostrar datos existentes
        document.getElementById('editarCliente').value = this.state.cotizacion?.cliente || '';
        document.getElementById('editarFactura').checked = this.state.cotizacion?.requiereFactura || false;
        document.getElementById('editarInstalacion').checked = this.state.cotizacion?.requiereInstalacion || false;
        document.getElementById('editarEspecificaciones').value = this.state.cotizacion?.especificaciones || '';

        // Agregar event listeners para los checkboxes
        document.getElementById('editarFactura').addEventListener('change', (e) => {
            // Actualizar inmediatamente el estado de la cotización
            this.state.cotizacion = {
                ...this.state.cotizacion,
                requiereFactura: e.target.checked
            };
            this.actualizarVistaPrevia();
        });

        document.getElementById('editarInstalacion').addEventListener('change', (e) => {
            // Actualizar inmediatamente el estado de la cotización
            this.state.cotizacion = {
                ...this.state.cotizacion,
                requiereInstalacion: e.target.checked
            };
            this.actualizarVistaPrevia();
        });

        const editarListaProductos = document.getElementById('editarListaProductos');
        editarListaProductos.innerHTML = '';

        this.state.productosArray.forEach((producto, index) => {
            const item = document.createElement('div');
            item.className = 'producto-item';
            
            item.innerHTML = `
                <div style="flex: 2;">
                    <div class="edicion-producto">
                        <input type="text" 
                            value="${producto.descripcion}" 
                            onchange="CotizacionManager.actualizarDescripcionProducto(${index}, this.value)"
                            class="input-descripcion">
                        <div class="medidas-texto">${producto.medidas || ''}</div>
                        <div class="precio-edicion">
                            <label>Precio: $</label>
                            <input type="number" 
                                value="${producto.precio}" 
                                onchange="CotizacionManager.actualizarPrecioProducto(${index}, this.value)"
                                min="0" 
                                step="0.01">
                            MXN
                        </div>
                    </div>
                </div>
                <div style="flex: 1; text-align: right;">
                    <button onclick="CotizacionManager.eliminarProducto(${index})" class="btn-secondary">
                        Eliminar
                    </button>
                </div>
            `;
            
            editarListaProductos.appendChild(item);
        });

        // Cambiar visibilidad de los formularios
        document.getElementById('cotizacionForm').style.display = 'none';
        document.getElementById('vistaPrevia').style.display = 'none';
        document.getElementById('editarForm').style.display = 'block';
        
        // Actualizar estado
        this.state.editando = true;
    },

    // Mostrar formulario para agregar producto en edición
    mostrarFormularioEnEdicion() {
        const formularioNuevo = document.getElementById('formularioNuevoProducto');
        formularioNuevo.style.display = 'block';
        
        // Event listener para el tipo de producto en edición
        document.getElementById('tipoProductoEdicion').addEventListener('change', (e) => {
            const tipo = e.target.value;
            const campos = {
                medidasEdicion: ['1', '2', '3', '4', '5', '8'],
                opcionesNeonEdit: ['3'],
                opcionesLonaEdit: ['4'],
                opcionesVinilEdit: ['5'],
                opcionesLetras3DEdit: ['6'],
                opcionesLetrasPlanasEdit: ['7'],
                opcionesBannerEdit: ['8'],
                opcionesCircularEdit: ['9'],
                otroProductoEdit: ['10']
            };

            // Ocultar todos los campos
            Object.keys(campos).forEach(id => {
                const elemento = document.getElementById(id);
                if (elemento) elemento.style.display = 'none';
            });

            // Mostrar campos relevantes
            Object.entries(campos).forEach(([id, tipos]) => {
                if (tipos.includes(tipo)) {
                    const elemento = document.getElementById(id);
                    if (elemento) elemento.style.display = 'block';
                }
            });
        });
    },

    agregarProductoEnEdicion() {
        const tipo = document.getElementById('tipoProductoEdicion').value;
        if (!tipo) {
            this.mostrarMensaje("Seleccione un tipo de producto", "error");
            return;
        }

        const nuevoProducto = this.crearProducto(tipo, 'Edicion');
        if (nuevoProducto) {
            this.state.productosArray.push(nuevoProducto);
            this.actualizarVistaEdicion();
            this.actualizarVistaPrevia();
            
            // Limpiar campos
            document.getElementById('tipoProductoEdicion').value = '';
            document.getElementById('baseEdicion').value = '';
            document.getElementById('alturaEdicion').value = '';
            document.getElementById('descripcionOtroEdit').value = '';
            document.getElementById('costoOtroEdit').value = '';
            
            // Ocultar formulario
            document.getElementById('formularioNuevoProducto').style.display = 'none';
            
            this.mostrarMensaje("Producto agregado correctamente", "success");
        }
    },

    actualizarVistaEdicion() {
        const editarListaProductos = document.getElementById('editarListaProductos');
        editarListaProductos.innerHTML = '';

        this.state.productosArray.forEach((producto, index) => {
            const item = document.createElement('div');
            item.className = 'producto-item';
            
            item.innerHTML = `
                <div style="flex: 2;">
                    <div class="edicion-producto">
                        <input type="text" 
                            value="${producto.descripcion}" 
                            onchange="CotizacionManager.actualizarDescripcionProducto(${index}, this.value)"
                            class="input-descripcion">
                        <div class="medidas-texto">${producto.medidas || ''}</div>
                        <div class="precio-edicion">
                            <label>Precio: $</label>
                            <input type="number" 
                                value="${producto.precio}" 
                                onchange="CotizacionManager.actualizarPrecioProducto(${index}, this.value)"
                                min="0" 
                                step="0.01">
                            MXN
                        </div>
                    </div>
                </div>
                <div style="flex: 1; text-align: right;">
                    <button onclick="CotizacionManager.eliminarProducto(${index})" class="btn-secondary">
                        Eliminar
                    </button>
                </div>
            `;
            
            editarListaProductos.appendChild(item);
        });
    },

    // Modificar la función guardarEdicion en CotizacionManager
    guardarEdicion() {
        const cliente = document.getElementById('editarCliente').value;
        if (!cliente) {
            this.mostrarMensaje("Ingrese el nombre del cliente", "error");
            return;
        }

        // Actualizar el estado inmediatamente con los valores actuales
        this.state.cotizacion = {
            cliente: cliente,
            fecha: new Date().toLocaleDateString(),
            productos: [...this.state.productosArray],
            especificaciones: document.getElementById('editarEspecificaciones').value,
            requiereFactura: document.getElementById('editarFactura').checked,
            requiereInstalacion: document.getElementById('editarInstalacion').checked
        };

        // Forzar la actualización de ambas vistas
        this.actualizarVistaPrevia();
        this.actualizarVistaProductos();

        document.getElementById('editarForm').style.display = 'none';
        document.getElementById('vistaPrevia').style.display = 'block';
        this.state.editando = false;
        this.mostrarMensaje("Cambios guardados correctamente", "success");
    },

    // Cerrar edición y mostrar vista previa
    cerrarEdicion() {
        // Ocultar formulario de edición
        document.getElementById('editarForm').style.display = 'none';
        // Mostrar vista previa
        document.getElementById('vistaPrevia').style.display = 'block';
        // Resetear estado de edición
        this.state.editando = false;
        // Ocultar formulario de nuevo producto si está visible
        document.getElementById('formularioNuevoProducto').style.display = 'none';
        // Mostrar mensaje
        this.mostrarMensaje("Edición cancelada", "success");
    },

    // Cerrar formulario y mostrar vista previa
    cerrarFormulario() {
        document.getElementById('cotizacionForm').style.display = 'none';
        document.getElementById('vistaPrevia').style.display = 'block';
        // Limpiar campos
        document.getElementById('clienteNombre').value = '';
        document.getElementById('requiereFactura').checked = false;
        document.getElementById('requiereInstalacion').checked = false;
        document.getElementById('listaProductos').innerHTML = '';
        // Resetear estado
        this.resetState();
        this.mostrarMensaje("Formulario cancelado", "success");
    },

    // Actualizar todas las vistas
    actualizarVistas() {
        this.actualizarVistaProductos();
        this.actualizarVistaPrevia();
    },

    // Mostrar mensaje
    mostrarMensaje(mensaje, tipo) {
        const mensajesDiv = document.getElementById("mensajes");
        mensajesDiv.innerHTML = `<div class="mensaje ${tipo}">${mensaje}</div>`;
        setTimeout(() => { mensajesDiv.innerHTML = ""; }, 3000);
    },

    // Actualizar vista de productos
    actualizarVistaProductos() {
        const lista = document.getElementById('listaProductos');
        if (!lista) return;
        
        lista.innerHTML = '';
        this.state.productosArray.forEach((producto, index) => {
            const item = document.createElement('div');
            item.className = 'producto-item';
            item.innerHTML = `
                <div>
                    <strong>${producto.descripcion}</strong>
                    ${producto.medidas ? `<br>${producto.medidas}` : ''}
                    <br>Precio: $${this.formatearNumero(parseFloat(producto.precio).toFixed(2))} MXN
                </div>
                <button onclick="CotizacionManager.eliminarProducto(${index})" class="btn-secondary">
                    Eliminar
                </button>
            `;
            lista.appendChild(item);
        });
    },

    // Actualizar vista previa de la cotización
    actualizarVistaPrevia() {
        const cliente = document.getElementById(this.state.editando ? 'editarCliente' : 'clienteNombre').value;
        if (!cliente || this.state.productosArray.length === 0) return;
        
        let texto = `¡Hola ${cliente}!\n`;
        texto += `Fecha: ${new Date().toLocaleDateString()}\n\n`;
        texto += `COTIZACIÓN:\n\n`;

        let subtotal = 0;
        this.state.productosArray.forEach((producto, index) => {
            texto += `${index + 1}. ${producto.descripcion}\n`;
            if (producto.medidas) {
                texto += `   ${producto.medidas}\n`;
            }
            texto += `   Precio: $${this.formatearNumero(producto.precio.toFixed(2))} MXN\n\n`;
            subtotal += producto.precio;
        });

        const requiereFactura = document.getElementById(this.state.editando ? 'editarFactura' : 'requiereFactura').checked;
        const requiereInstalacion = document.getElementById(this.state.editando ? 'editarInstalacion' : 'requiereInstalacion').checked;

        if (requiereFactura) {
            const iva = subtotal * 0.16;
            texto += `\nSubtotal: $${this.formatearNumero(subtotal.toFixed(2))} MXN\n`;
            texto += `IVA (16%): $${this.formatearNumero(iva.toFixed(2))} MXN\n`;
            texto += `Total: $${this.formatearNumero((subtotal + iva).toFixed(2))} MXN\n`;
        } else {
            texto += `\nTotal: $${this.formatearNumero(subtotal.toFixed(2))} MXN\n`;
        }

        if (requiereInstalacion) {
            texto += `\nInstalación incluida`;
        }

        // Agregar especificaciones adicionales
        const especificaciones = document.getElementById(this.state.editando ? 'editarEspecificaciones' : 'especificaciones')?.value;
        if (especificaciones && especificaciones.trim()) {
            texto += `\n\nEspecificaciones adicionales:\n${especificaciones}`;
        }

        texto += `\n\n¡Gracias por tu preferencia!`;
        
        document.getElementById('vistaPrevia').textContent = texto;
    },

    // Generar cotización
    generarCotizacion() {
        const cliente = document.getElementById('clienteNombre').value;
        if (!cliente) {
            this.mostrarMensaje("Por favor ingrese el nombre del cliente", "error");
            return;
        }

        if (this.state.productosArray.length === 0) {
            this.mostrarMensaje("Agregue al menos un producto", "error");
            return;
        }

        this.state.cotizacion = {
            cliente: cliente,
            fecha: new Date().toLocaleDateString(),
            productos: [...this.state.productosArray],
            requiereFactura: document.getElementById('requiereFactura').checked,
            requiereInstalacion: document.getElementById('requiereInstalacion').checked,
            especificaciones: document.getElementById('especificaciones')?.value
        };

        this.actualizarVistaPrevia();
        document.getElementById('cotizacionForm').style.display = 'none';
        document.getElementById('vistaPrevia').style.display = 'block';
        this.mostrarMensaje("Cotización generada correctamente", "success");
    },

    // Generar contenido Markdown
    generarContenidoMarkdown() {
        if (!this.state.cotizacion || !this.state.productosArray.length) {
            this.mostrarMensaje("No hay cotización para exportar", "error");
            return null;
        }

        let subtotal = 0;
        let productosTexto = '';
        this.state.productosArray.forEach((producto, index) => {
            productosTexto += `${index + 1}. **${producto.descripcion}**\n`;
            if (producto.medidas) {
                productosTexto += `   - Medidas: ${producto.medidas}\n`;
            }
            productosTexto += `   - Precio: $${this.formatearNumero(parseFloat(producto.precio).toFixed(2))} MXN\n\n`;
            subtotal += parseFloat(producto.precio);
        });

        const iva = this.state.cotizacion.requiereFactura ? subtotal * 0.16 : 0;
        const total = subtotal + iva;

        let contenido = `# Cotización
    
## Información General
- **Fecha:** ${new Date().toLocaleDateString()}
- **Cliente:** ${this.state.cotizacion.cliente}

## Productos y Servicios
${productosTexto}
## Resumen de Costos
`;

        if (this.state.cotizacion.requiereFactura) {
            contenido += `- **Subtotal:** $${this.formatearNumero(subtotal.toFixed(2))} MXN
- **IVA (16%):** $${this.formatearNumero(iva.toFixed(2))} MXN
- **Total:** $${this.formatearNumero(total.toFixed(2))} MXN
`;
        } else {
            contenido += `- **Total:** $${this.formatearNumero(subtotal.toFixed(2))} MXN\n`;
        }

        contenido += `
## Detalles Adicionales
- **Instalación:** ${this.state.cotizacion.requiereInstalacion ? "Incluida" : "No incluida"}
- **Método de pago:**
  - Transferencia bancaria
  - Efectivo en sucursal
  - Anticipo: 50%
- **Tiempo de entrega:** De 10 a 15 días hábiles

## Garantía
- Fabricación: 1 año
- Iluminación: Sin garantía

## Notas
- Vigencia de la cotización: 10 días
- El precio indicado aplica únicamente para la CDMX y el área metropolitana
- Para otras zonas, se agregará una tarifa extra`;

        if (this.state.cotizacion.especificaciones?.trim()) {
            contenido += `

## Especificaciones Adicionales
${this.state.cotizacion.especificaciones}`;
        }

        return contenido;
    },

    // Exportar como Markdown
    exportarComoMarkdown() {
        const contenido = this.generarContenidoMarkdown();
        if (!contenido) return;

        const fecha = new Date().toISOString().split('T')[0];
        const cliente = this.state.cotizacion.cliente.replace(/\s+/g, '_');
        const nombreArchivo = `cotizacion_${cliente}_${fecha}.md`;

        const blob = new Blob([contenido], { type: 'text/markdown;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = nombreArchivo;
        link.click();
        URL.revokeObjectURL(link.href);

        this.mostrarMensaje("Cotización exportada como Markdown", "success");
    },

    // Agregar esta función auxiliar al CotizacionManager
    formatearNumero(numero) {
        return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
};

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    CotizacionManager.init();
    
    // Agregar listener para el select de tipo de producto
    document.getElementById('tipoProducto').addEventListener('change', (e) => {
        CotizacionManager.mostrarCamposEspecificos(e.target.value);
    });
});

// Modificar las funciones globales
function mostrarFormulario() {
    CotizacionManager.mostrarFormulario();
}

function agregarProducto() {
    CotizacionManager.agregarProducto();
}

function editarCotizacion() {
    CotizacionManager.editarCotizacion();
}

// Volver a dejar generarCotizacionDesdeForm sin confirmación
function generarCotizacionDesdeForm() {
    CotizacionManager.generarCotizacion();
}

function mostrarFormularioEnEdicion() {
    CotizacionManager.mostrarFormularioEnEdicion();
}

function agregarProductoEnEdicion() {
    CotizacionManager.agregarProductoEnEdicion();
}

function guardarEdicion() {
    CotizacionManager.guardarEdicion();
}

// Agregar con las otras funciones globales
function exportarMarkdown() {
    CotizacionManager.exportarComoMarkdown();
}

// Agregar con las otras funciones globales
function cerrarEdicion() {
    CotizacionManager.cerrarEdicion();
}

// Agregar con las otras funciones globales
function cerrarFormulario() {
    CotizacionManager.cerrarFormulario();
}