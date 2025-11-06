import { Calculations } from '../utils/calculations.js';
import { Helpers } from '../utils/helpers.js';

export class ProductManager {
    constructor() {
        this.productos = [];
    }

    crearProducto(tipo, suffix = '') {
        const base = parseFloat(document.getElementById(`base${suffix}`)?.value) || 0;
        const altura = parseFloat(document.getElementById(`altura${suffix}`)?.value) || 0;
        
        let producto = {
            tipo: tipo,
            descripcion: '',
            precio: 0,
            medidas: ''
        };

        switch (tipo) {
            case "1": // Caja de Acrílico - TUS PRECIOS ORIGINALES
                if (!base || !altura) {
                    Helpers.mostrarMensaje("Ingrese las medidas", "error");
                    return null;
                }
                producto.descripcion = "Caja de Acrílico";
                producto.precio = Calculations.sumaArea(base, altura, 18); // Tu precio original
                producto.medidas = `${base}cm x ${altura}cm`;
                break;

            case "2": // Caja de Lona - TU PRECIO ORIGINAL
                if (!base || !altura) {
                    Helpers.mostrarMensaje("Ingrese las medidas", "error");
                    return null;
                }
                producto.descripcion = "Caja de Lona";
                producto.precio = Calculations.sumaArea(base, altura, 15); // Tu precio original
                producto.medidas = `${base}cm x ${altura}cm`;
                break;

            case "3": // Neón - TUS PRECIOS ORIGINALES
                if (!base || !altura) {
                    Helpers.mostrarMensaje("Ingrese las medidas", "error");
                    return null;
                }
                const tipoNeon = document.getElementById(suffix === 'Edicion' ? 'tipoNeonEdit' : 'tipoNeon')?.value;
                if (!tipoNeon) {
                    Helpers.mostrarMensaje("Seleccione el tipo de neón", "error");
                    return null;
                }
                producto.descripcion = `Neón ${tipoNeon === "1" ? "Normal" : "2.0"}`;
                producto.precio = Calculations.sumaArea(base, altura, tipoNeon === "1" ? 18 : 25); // Tus precios originales
                producto.medidas = `${base}cm x ${altura}cm`;
                break;

            case "4": // Impresión Lona - TUS PRECIOS ORIGINALES
                if (!base || !altura) {
                    Helpers.mostrarMensaje("Ingrese las medidas", "error");
                    return null;
                }
                const calidadLona = document.getElementById(`calidadLona${suffix === 'Edicion' ? 'Edit' : ''}`)?.value;
                if (!calidadLona) {
                    Helpers.mostrarMensaje("Seleccione la calidad de lona", "error");
                    return null;
                }
                const preciosLona = {1: 110, 2: 250, 3: 340}; // Tus precios originales
                producto.descripcion = `Impresión Lona ${["720", "Alta", "UV"][parseInt(calidadLona)-1]}`;
                producto.precio = Calculations.multiplicacionArea(base, altura, preciosLona[calidadLona]);
                producto.medidas = `${base}cm x ${altura}cm`;
                break;

            case "5": // Impresión Vinil - TUS PRECIOS ORIGINALES
                if (!base || !altura) {
                    Helpers.mostrarMensaje("Ingrese las medidas", "error");
                    return null;
                }
                const calidadVinil = document.getElementById(suffix === 'Edicion' ? 'calidadVinilEdit' : 'calidadVinil')?.value;
                if (!calidadVinil) {
                    Helpers.mostrarMensaje("Seleccione la calidad del vinil", "error");
                    return null;
                }
                const preciosVinil = {1: 224, 2: 340, 3: 460, 4: 640}; // Tus precios originales
                producto.descripcion = `Impresión Vinil ${["720", "Alta", "UV", "UV 3M"][parseInt(calidadVinil)-1]}`;
                producto.precio = Calculations.multiplicacionArea(base, altura, preciosVinil[calidadVinil]);
                producto.medidas = `${base}cm x ${altura}cm`;
                break;

            case "6": // Letras 3D - TUS PRECIOS ORIGINALES
                const altura3D = parseFloat(document.getElementById(suffix === 'Edicion' ? 'altura3DEdit' : 'altura3D')?.value);
                const material3D = document.getElementById(suffix === 'Edicion' ? 'material3DEdit' : 'material3D')?.value;

                // CAMPOS INFORMATIVOS AHORA OBLIGATORIOS
                const base3D = parseFloat(document.getElementById(suffix === 'Edicion' ? 'base3DEdit' : 'base3D')?.value);
                const alturaInfo3D = parseFloat(document.getElementById(suffix === 'Edicion' ? 'alturaInfo3DEdit' : 'alturaInfo3D')?.value);

                // VALIDACIONES - Todos los campos obligatorios
                if (!altura3D) {
                    Helpers.mostrarMensaje("Ingrese la altura para cotización", "error");
                    return null;
                }
                if (!material3D) {
                    Helpers.mostrarMensaje("Seleccione el material", "error");
                    return null;
                }
                if (!base3D) {
                    Helpers.mostrarMensaje("Ingrese la base", "error");
                    return null;
                }
                if (!alturaInfo3D) {
                    Helpers.mostrarMensaje("Ingrese la altura real", "error");
                    return null;
                }

                const precios3D = {1: 35, 2: 25, 3: 30, 4: 20}; // Tus precios originales
                producto.descripcion = `Letras 3D ${["Acrílico con luz", "Aluminio con luz", "Acrílico sin luz", "Aluminio sin luz"][parseInt(material3D)-1]}`;
                
                // PRECIO SOLO CON ALTURA DE COTIZACIÓN
                producto.precio = Calculations.sumaAltura(altura3D, precios3D[material3D]);
                
                // MEDIDAS SIEMPRE EN FORMATO BASE x ALTURA
                producto.medidas = `${base3D}cm x ${alturaInfo3D}cm`;
                break;

            case "7": // Letras Planas - TUS PRECIOS ORIGINALES
                const alturaPlanas = parseFloat(document.getElementById(suffix === 'Edicion' ? 'alturaPlanasEdit' : 'alturaPlanas')?.value);
                const materialPlanas = document.getElementById(suffix === 'Edicion' ? 'materialPlanasEdit' : 'materialPlanas')?.value;
                
                // CAMPOS INFORMATIVOS AHORA OBLIGATORIOS
                const basePlanas = parseFloat(document.getElementById(suffix === 'Edicion' ? 'basePlanasEdit' : 'basePlanas')?.value);
                const alturaInfoPlanas = parseFloat(document.getElementById(suffix === 'Edicion' ? 'alturaInfoPlanasEdit' : 'alturaInfoPlanas')?.value);
                
                // VALIDACIONES - Todos los campos obligatorios
                if (!alturaPlanas) {
                    Helpers.mostrarMensaje("Ingrese la altura para cotización", "error");
                    return null;
                }
                if (!materialPlanas) {
                    Helpers.mostrarMensaje("Seleccione el material", "error");
                    return null;
                }
                if (!basePlanas) {
                    Helpers.mostrarMensaje("Ingrese la base", "error");
                    return null;
                }
                if (!alturaInfoPlanas) {
                    Helpers.mostrarMensaje("Ingrese la altura real", "error");
                    return null;
                }
                
                const preciosPlanas = {1: 18, 2: 12}; // Tus precios originales
                producto.descripcion = `Letras Planas ${["Acrílico", "Aluminio"][parseInt(materialPlanas)-1]}`;
                
                // PRECIO SOLO CON ALTURA DE COTIZACIÓN
                producto.precio = Calculations.sumaAltura(alturaPlanas, preciosPlanas[materialPlanas]);
                
                // MEDIDAS SIEMPRE EN FORMATO BASE x ALTURA
                producto.medidas = `${basePlanas}cm x ${alturaInfoPlanas}cm`;
                break;

            case "8": // Banner Lona - TUS PRECIOS ORIGINALES
                if (!base || !altura) {
                    Helpers.mostrarMensaje("Ingrese las medidas", "error");
                    return null;
                }
                const calidadBanner = document.getElementById(suffix === 'Edicion' ? 'calidadBannerEdit' : 'calidadBanner')?.value;
                if (!calidadBanner) {
                    Helpers.mostrarMensaje("Seleccione la calidad del banner", "error");
                    return null;
                }
                const preciosBanner = {1: 800, 2: 900}; // Tus precios originales
                producto.descripcion = `Banner Lona ${["720", "Alta"][parseInt(calidadBanner)-1]}`;
                producto.precio = Calculations.multiplicacionArea(base, altura, preciosBanner[calidadBanner]);
                producto.medidas = `${base}cm x ${altura}cm`;
                break;

            case "9": // Caja Circular - TU PRECIO ORIGINAL
                const areaCircular = parseFloat(document.getElementById(`areaCircular${suffix === 'Edicion' ? 'Edit' : ''}`)?.value);
                if (!areaCircular) {
                    Helpers.mostrarMensaje("Ingrese el área", "error");
                    return null;
                }
                producto.descripcion = "Caja Circular";
                producto.precio = areaCircular * 45; // Tu precio original
                producto.medidas = `${areaCircular}cm²`;
                break;

            case "10": // Otro
                const otroSuffix = suffix === 'Edicion' ? 'Edit' : '';
                const descripcionOtro = document.getElementById(`descripcionOtro${otroSuffix}`)?.value;
                const costoOtro = parseFloat(document.getElementById(`costoOtro${otroSuffix}`)?.value);

                if (!descripcionOtro || isNaN(costoOtro)) {
                    Helpers.mostrarMensaje("Complete la descripción y el costo", "error");
                    return null;
                }
                producto.descripcion = descripcionOtro;
                producto.precio = costoOtro;
                producto.medidas = ""; // CAMBIAR: Dejar vacío en lugar de "Personalizado"
                break;

            default:
                Helpers.mostrarMensaje("Seleccione un tipo de producto válido", "error");
                return null;
        }

        return producto;
    }

    agregarProducto(producto) {
        this.productos.push(producto);
        this.actualizarListaHTML();
        Helpers.mostrarMensaje("Producto agregado correctamente", "success");
    }

    eliminarProducto(index) {
        this.productos.splice(index, 1);
        this.actualizarListaHTML(); // Actualizar lista principal
        Helpers.mostrarMensaje("Producto eliminado", "success");
    }

    actualizarListaHTML() {
        const lista = document.getElementById('listaProductos');
        if (!lista) return;

        if (this.productos.length === 0) {
            lista.innerHTML = '<p>No hay productos agregados</p>';
            return;
        }

        let html = '<div class="productos-agregados">';
        this.productos.forEach((producto, index) => {
            html += `
                <div class="producto-item">
                    <div class="producto-info">
                        <strong>${producto.descripcion}</strong><br>
                        ${producto.medidas ? `<span class="medidas">${producto.medidas}</span><br>` : ''}
                        <span class="precio">$${Helpers.formatearNumero(producto.precio.toFixed(2))} MXN</span>
                    </div>
                    <button onclick="eliminarProducto(${index})" class="btn-eliminar">
                        Eliminar
                    </button>
                </div>
            `;
        });
        html += '</div>';
        
        const total = this.calcularTotal();
        html += `<div class="total-productos"><strong>Total: $${Helpers.formatearNumero(total.toFixed(2))} MXN</strong></div>`;
        
        lista.innerHTML = html;
    }

    calcularTotal() {
        return this.productos.reduce((total, producto) => total + producto.precio, 0);
    }

    limpiarFormulario(suffix = '') {
        const campos = [
            'base', 'altura', 'altura3D', 'alturaPlanas', 'areaCircular', 
            'descripcionOtro', 'costoOtro',
            // CAMPOS INFORMATIVOS CON DOS ALTURAS
            'base3D', 'alturaInfo3D', 'basePlanas', 'alturaInfoPlanas'
        ];
        
        campos.forEach(campo => {
            const elemento = document.getElementById(campo + suffix);
            if (elemento) elemento.value = '';
        });

        // Limpiar también los selects
        const selects = ['tipoNeon', 'calidadLona', 'calidadVinil', 'material3D', 'materialPlanas', 'calidadBanner'];
        selects.forEach(select => {
            const elemento = document.getElementById(select + suffix);
            if (elemento) elemento.selectedIndex = 0;
        });
    }

    obtenerProductos() {
        return this.productos;
    }

    // Tu función de editar productos desde el estado
    actualizarDescripcionProducto(index, valor) {
        if (this.productos[index]) {
            this.productos[index].descripcion = valor;
            Helpers.mostrarMensaje("Descripción actualizada", "success");
        }
    }

    actualizarPrecioProducto(index, valor) {
        if (this.productos[index]) {
            this.productos[index].precio = parseFloat(valor);
            Helpers.mostrarMensaje("Precio actualizado", "success");
        }
    }
}