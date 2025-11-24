import { Helpers } from '../utils/helpers.js';

export class FormManager {
    mostrarFormulario() {
        document.getElementById('cotizacionForm').style.display = 'block';
        document.getElementById('vistaPrevia').style.display = 'none';
        document.getElementById('editarForm').style.display = 'none';
    }

    cerrarFormulario() {
        document.getElementById('cotizacionForm').style.display = 'none';
        document.getElementById('vistaPrevia').style.display = 'block';
    }

    // NUEVO - Método para ocultar todos los campos específicos
    ocultarTodosLosCampos(esEdicion = false) {
        const suffix = esEdicion ? 'Editar' : '';
        
        const campos = [
            'medidas', 'opcionesNeon', 'opcionesLona', 'opcionesVinil',
            'opcionesLetras3D', 'opcionesLetrasPlanas', 'opcionesBanner',
            'opcionesCircular', 'opcionesDobleVista', 'otroProducto' // ASEGURAR que opcionesDobleVista esté aquí
        ];
        
        campos.forEach(campo => {
            const elemento = document.getElementById(`${campo}${suffix}`);
            if (elemento) {
                elemento.style.display = 'none';
            }
        });
    }

    mostrarCamposEspecificos(tipo, esEdicion = false) {
        // Primero ocultar todos los campos
        this.ocultarTodosLosCampos(esEdicion);

        const suffix = esEdicion ? 'Edit' : '';
        
        // Mostrar campos relevantes según el tipo
        if (['1', '2', '3', '4', '5', '8'].includes(tipo)) {
            const medidas = document.getElementById(esEdicion ? 'medidasEdicion' : 'medidas');
            if (medidas) medidas.style.display = 'block';
        }

        // Campos específicos por tipo
        const mapaCampos = esEdicion ? {
            '3': 'opcionesNeonEdit',
            '4': 'opcionesLonaEdit',
            '5': 'opcionesVinilEdit',
            '6': 'opcionesLetras3DEdit',
            '7': 'opcionesLetrasPlanasEdit',
            '8': 'opcionesBannerEdit',
            '9': 'opcionesCircularEdit',
            '10': 'otroProductoEdit'
        } : {
            '3': 'opcionesNeon',
            '4': 'opcionesLona',
            '5': 'opcionesVinil',
            '6': 'opcionesLetras3D',
            '7': 'opcionesLetrasPlanas',
            '8': 'opcionesBanner',
            '9': 'opcionesCircular',
            '10': 'otroProducto'
        };

        if (mapaCampos[tipo]) {
            const elemento = document.getElementById(mapaCampos[tipo]);
            if (elemento) elemento.style.display = 'block';
        } else if (tipo === "9") { // Caja circular
            const opcionesCircular = document.getElementById(`opcionesCircular${suffix}`);
            if (opcionesCircular) {
                opcionesCircular.style.display = "block";
            }
        } else if (tipo === "11") {
            const opcionesDobleVista = document.getElementById(`opcionesDobleVista${suffix}`);
            if (opcionesDobleVista) opcionesDobleVista.style.display = "block";
        }
    }
}