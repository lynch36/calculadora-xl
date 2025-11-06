import { Helpers } from '../utils/helpers.js';

export class ExportManager {
    constructor(quoteGenerator) {
        this.quoteGenerator = quoteGenerator;
    }

    exportarMarkdown() {
        if (!this.quoteGenerator) {
            Helpers.mostrarMensaje("No hay cotización para exportar", "error");
            return;
        }

        const contenido = this.quoteGenerator.generarContenidoMarkdown();
        if (!contenido) {
            Helpers.mostrarMensaje("No hay cotización para exportar", "error");
            return;
        }

        const cotizacion = this.quoteGenerator.obtenerCotizacion();
        const fecha = new Date().toISOString().split('T')[0];
        const cliente = cotizacion.cliente.replace(/\s+/g, '_');
        const nombreArchivo = `cotizacion_${cliente}_${fecha}.md`;

        const blob = new Blob([contenido], { type: 'text/markdown;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = nombreArchivo;
        link.click();
        URL.revokeObjectURL(link.href);

        Helpers.mostrarMensaje("Cotización exportada como Markdown", "success");
    }

    exportarPDF() {
        Helpers.mostrarMensaje("Función PDF pendiente de implementar", "info");
    }
}