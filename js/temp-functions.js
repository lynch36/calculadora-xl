// Funciones temporales hasta que los módulos estén completos
function mostrarFormulario() {
    if (window.CotizacionApp && window.CotizacionApp.formManager) {
        window.CotizacionApp.formManager.mostrarFormulario();
    } else {
        console.log('Mostrando formulario (función temporal)');
        document.getElementById('cotizacionForm').style.display = 'block';
        document.getElementById('vistaPrevia').style.display = 'none';
        document.getElementById('editarForm').style.display = 'none';
    }
}

function cerrarFormulario() {
    if (window.CotizacionApp && window.CotizacionApp.formManager) {
        window.CotizacionApp.formManager.cerrarFormulario();
    } else {
        console.log('Cerrando formulario (función temporal)');
        document.getElementById('cotizacionForm').style.display = 'none';
        document.getElementById('vistaPrevia').style.display = 'block';
    }
}

function agregarProducto() {
    if (window.CotizacionApp && window.CotizacionApp.agregarProducto) {
        window.CotizacionApp.agregarProducto();
    } else {
        console.log('Agregar producto (App no disponible aún)');
    }
}

function eliminarProducto(index) {
    if (window.CotizacionApp && window.CotizacionApp.productManager) {
        window.CotizacionApp.productManager.eliminarProducto(index);
        
        // AGREGAR - Actualizar vistas dinámicamente
        if (window.CotizacionApp.state.editando) {
            window.CotizacionApp.actualizarVistaEdicion();
        }
        window.CotizacionApp.actualizarVistaPrevia();
    } else {
        console.log(`Eliminar producto ${index} (App no disponible aún)`);
    }
}

function editarCotizacion() {
    if (window.CotizacionApp && window.CotizacionApp.editarCotizacion) {
        window.CotizacionApp.editarCotizacion();
    } else {
        console.log('Editar cotización (función temporal)');
    }
}

function descargarPDF() {
    if (window.CotizacionApp && window.CotizacionApp.exportManager) {
        window.CotizacionApp.exportManager.exportarPDF();
    } else {
        console.log('Descargar PDF (función temporal)');
    }
}

function exportarMarkdown() {
    if (window.CotizacionApp && window.CotizacionApp.exportarComoMarkdown) {
        window.CotizacionApp.exportarComoMarkdown();
    } else {
        console.log('Exportar Markdown (función temporal)');
    }
}

function generarCotizacionDesdeForm() {
    console.log('Generando cotización desde form...');
    
    if (!window.CotizacionApp) {
        console.log('App no disponible');
        return;
    }

    const app = window.CotizacionApp;
    
    // Obtener datos del formulario
    const cliente = document.getElementById('clienteNombre').value.trim();
    const requiereFactura = document.getElementById('requiereFactura').checked;
    const requiereInstalacion = document.getElementById('requiereInstalacion').checked;
    
    // Validaciones
    if (!cliente) {
        alert('Ingrese el nombre del cliente');
        return;
    }
    
    const productos = app.productManager.obtenerProductos();
    if (productos.length === 0) {
        alert('Agregue al menos un producto');
        return;
    }
    
    // Generar cotización
    const opciones = {
        requiereFactura,
        requiereInstalacion
    };
    
    const cotizacion = app.quoteGenerator.generar(productos, cliente, opciones);
    
    // Mostrar vista previa
    mostrarVistaPrevia(cotizacion);
    
    // Cerrar formulario
    cerrarFormulario();
}

function mostrarVistaPrevia(cotizacion) {
    const vistaPrevia = document.getElementById('vistaPrevia');
    const subtotal = cotizacion.productos.reduce((sum, p) => sum + p.precio, 0);
    
    // CORREGIDO - No cobrar instalación, solo IVA si se requiere factura
    const iva = cotizacion.opciones.requiereFactura ? subtotal * 0.16 : 0;
    const total = subtotal + iva;
    
    let html = `
COTIZACIÓN
==========

Cliente: ${cotizacion.cliente}
Fecha: ${cotizacion.fecha}

PRODUCTOS:
----------
`;

    cotizacion.productos.forEach((producto, index) => {
        html += `${index + 1}. ${producto.descripcion}
   ${producto.medidas}
   $${producto.precio.toFixed(2)}

`;
    });

    html += `
TOTALES:
--------`;

    if (cotizacion.opciones.requiereFactura) {
        html += `
Subtotal: $${subtotal.toFixed(2)}
IVA (16%): $${iva.toFixed(2)}
Total: $${total.toFixed(2)}`;
    } else {
        html += `
Total: $${subtotal.toFixed(2)}`;
    }

    // Instalación solo informativa - NO SE COBRA
    if (cotizacion.opciones.requiereInstalacion) {
        html += `

Instalación incluida`;
    }

    html += `

Condiciones:
- Precios en pesos mexicanos
- Vigencia: 30 días
- 50% anticipo, 50% contra entrega`;

    vistaPrevia.textContent = html;
    vistaPrevia.style.display = 'block';
}

function guardarEdicion() {
    if (window.CotizacionApp && window.CotizacionApp.guardarEdicion) {
        window.CotizacionApp.guardarEdicion();
    } else {
        console.log('Guardar edición (función temporal)');
    }
}

function cerrarEdicion() {
    if (window.CotizacionApp && window.CotizacionApp.cerrarEdicion) {
        window.CotizacionApp.cerrarEdicion();
    } else {
        console.log('Cerrar edición (función temporal)');
    }
}

function mostrarFormularioEnEdicion() {
    if (window.CotizacionApp && window.CotizacionApp.mostrarFormularioEnEdicion) {
        window.CotizacionApp.mostrarFormularioEnEdicion();
    } else {
        console.log('Mostrar formulario en edición (función temporal)');
    }
}

function agregarProductoEnEdicion() {
    if (window.CotizacionApp && window.CotizacionApp.agregarProductoEnEdicion) {
        window.CotizacionApp.agregarProductoEnEdicion();
    } else {
        console.log('Agregar producto en edición (función temporal)');
    }
}