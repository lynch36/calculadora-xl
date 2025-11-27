import { Calculations } from '../utils/calculations.js';
import { Helpers } from '../utils/helpers.js';

export class QuoteGenerator {
    constructor() {
        this.cotizacion = null;
    }

    generar(productos, cliente, opciones = {}) {
        this.cotizacion = {
            cliente,
            productos,
            opciones,
            fecha: new Date().toLocaleDateString()
        };
        return this.cotizacion;
    }

    // Tu función original de vista previa - SIN COBRAR INSTALACIÓN
    generarVistaPrevia(productos, cliente, requiereFactura, requiereInstalacion, especificaciones = '') {
        if (!cliente || productos.length === 0) return '';
        
        let texto = `¡Hola ${cliente}!\n`;
        texto += `Fecha: ${new Date().toLocaleDateString()}\n\n`;
        texto += `COTIZACIÓN:\n\n`;

        let subtotal = 0;
        productos.forEach((producto, index) => {
            texto += `${index + 1}. ${producto.descripcion}\n`;
            if (producto.medidas) {
                texto += `   ${producto.medidas}\n`;
            }
            texto += `   Precio: $${Helpers.formatearNumero(producto.precio.toFixed(2))} MXN\n\n`;
            subtotal += producto.precio;
        });

        // TU LÓGICA ORIGINAL - Solo IVA, instalación es informativa
        if (requiereFactura) {
            const iva = Calculations.calcularIVA(subtotal);
            texto += `\nSubtotal: $${Helpers.formatearNumero(subtotal.toFixed(2))} MXN\n`;
            texto += `IVA (16%): $${Helpers.formatearNumero(iva.toFixed(2))} MXN\n`;
            texto += `Total: $${Helpers.formatearNumero((subtotal + iva).toFixed(2))} MXN\n`;
        } else {
            texto += `\nTotal: $${Helpers.formatearNumero(subtotal.toFixed(2))} MXN\n`;
        }

        // Instalación solo como texto informativo - NO SE COBRA
        if (requiereInstalacion) {
            texto += `\nInstalación incluida`;
        }

        // CORREGIR - Agregar especificaciones si existen
        if (especificaciones && especificaciones.trim()) {
            texto += `\n\nEspecificaciones adicionales:\n${especificaciones.trim()}`;
        }

        texto += `\n\n¡Gracias por tu preferencia!`;
        
        return texto;
    }

    // Tu función original de Markdown - SIN COBRAR INSTALACIÓN
    generarContenidoMarkdown() {
        if (!this.cotizacion || !this.cotizacion.productos.length) {
            return null;
        }

        let subtotal = 0;
        let productosTexto = '';
        this.cotizacion.productos.forEach((producto, index) => {
            productosTexto += `${index + 1}. **${producto.descripcion}**\n`;
            if (producto.medidas) {
                productosTexto += `   - Medidas: ${producto.medidas}\n`;
            }
            productosTexto += `   - Precio: $${Helpers.formatearNumero(parseFloat(producto.precio).toFixed(2))} MXN\n\n`;
            subtotal += parseFloat(producto.precio);
        });

        // TU LÓGICA ORIGINAL - Solo IVA si se requiere factura
        const iva = this.cotizacion.opciones.requiereFactura ? Calculations.calcularIVA(subtotal) : 0;
        const total = subtotal + iva;

        let contenido = `# Cotización
    
## Información General
- **Fecha:** ${new Date().toLocaleDateString()}
- **Cliente:** ${this.cotizacion.cliente}

## Productos y Servicios
${productosTexto}
## Resumen de Costos
- **Subtotal productos:** $${Helpers.formatearNumero(subtotal.toFixed(2))} MXN
`;

        if (this.cotizacion.opciones.requiereFactura) {
            contenido += `- **IVA (16%):** $${Helpers.formatearNumero(iva.toFixed(2))} MXN
- **Total:** $${Helpers.formatearNumero(total.toFixed(2))} MXN
`;
        } else {
            contenido += `- **Total:** $${Helpers.formatearNumero(subtotal.toFixed(2))} MXN\n`;
        }

        contenido += `
## Detalles Adicionales
- **Instalación:** ${this.cotizacion.opciones.requiereInstalacion ? "Incluida" : "No incluida"}
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

        if (this.cotizacion.opciones.especificaciones?.trim()) {
            contenido += `

## Especificaciones Adicionales
${this.cotizacion.opciones.especificaciones}`;
        }

        return contenido;
    }

    obtenerCotizacion() {
        return this.cotizacion;
    }

    setProductManager(productManager) {
        this.productManager = productManager;
    }

    actualizarTotales() {
        const subtotal = this.productManager.calcularSubtotal();
        const iva = Calculations.calcularIVA(subtotal);
        const total = subtotal + iva;
    
        const zona = document.getElementById('zonaServicio')?.value;
        const tieneViaticos = zona === 'cdmx' && this.productManager.productos.length > 0;
        
        const resumenElement = document.getElementById('resumenCostos');
        if (resumenElement) {
            resumenElement.innerHTML = `
                <h3>💰 Resumen de Costos</h3>
                <div class="resumen-linea">
                    <span>Subtotal:</span>
                    <span>$${subtotal.toFixed(2)}</span>
                </div>
                ${tieneViaticos ? `
                <div class="resumen-linea viaticos">
                    <span>Viáticos CDMX:</span>
                    <span>$1,000.00 (distribuido)</span>
                </div>
                ` : ''}
                <div class="resumen-linea">
                    <span>IVA (16%):</span>
                    <span>$${iva.toFixed(2)}</span>
                </div>
                <div class="resumen-linea total">
                    <span><strong>Total:</strong></span>
                    <span><strong>$${total.toFixed(2)}</strong></span>
                </div>
            `;
        }
    }
}