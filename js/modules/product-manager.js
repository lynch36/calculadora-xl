import { Calculations } from '../utils/calculations.js';
import { Helpers } from '../utils/helpers.js';

export class ProductManager {
    constructor() {
        this.productos = [];
        this.contadorId = 1;
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
            case "1": // Caja de Acrílico
                if (!base || !altura) {
                    Helpers.mostrarMensaje("Ingrese las medidas", "error");
                    return null;
                }
                
                const baseMetros = base / 100;
                const alturaMetros = altura / 100;
                
                producto.descripcion = "Caja de Acrílico";
                producto.precio = (baseMetros * alturaMetros) * 1800;
                producto.medidas = `${base}cm x ${altura}cm (${(baseMetros * alturaMetros).toFixed(2)}m²)`;
                break;

            case "2": // Caja de Lona
                if (!base || !altura) {
                    Helpers.mostrarMensaje("Ingrese las medidas", "error");
                    return null;
                }
                
                const baseMetrosLona = base / 100;
                const alturaMetrosLona = altura / 100;
                
                producto.descripcion = "Caja de Lona";
                producto.precio = (baseMetrosLona * alturaMetrosLona) * 1500;
                producto.medidas = `${base}cm x ${altura}cm (${(baseMetrosLona * alturaMetrosLona).toFixed(2)}m²)`;
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

            case "4": // Impresión Lona - PRECIOS ORIGINALES
                if (!base || !altura) {
                    Helpers.mostrarMensaje("Ingrese las medidas", "error");
                    return null;
                }
                const calidadLona = document.getElementById(`calidadLona${suffix === 'Editar' ? 'Editar' : ''}`)?.value;
                if (!calidadLona) {
                    Helpers.mostrarMensaje("Seleccione la calidad de lona", "error");
                    return null;
                }
                const preciosLona = {1: 110, 2: 250, 3: 340}; // Tus precios originales
                producto.descripcion = `Impresión Lona ${["720", "Alta", "UV"][parseInt(calidadLona)-1]}`;
                producto.precio = Calculations.multiplicacionArea(base, altura, preciosLona[calidadLona]);
                producto.medidas = `${base}cm x ${altura}cm`;
                break;

            case "5": // Impresión Vinil - PRECIOS ORIGINALES
                if (!base || !altura) {
                    Helpers.mostrarMensaje("Ingrese las medidas", "error");
                    return null;
                }
                const calidadVinil = document.getElementById(suffix === 'Editar' ? 'calidadVinilEditar' : 'calidadVinil')?.value;
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
                const altura3D = parseFloat(document.getElementById(suffix === 'Editar' ? 'altura3DEditar' : 'altura3D')?.value);
                const material3D = document.getElementById(suffix === 'Editar' ? 'material3DEditar' : 'material3D')?.value;

                // CAMPOS INFORMATIVOS AHORA OBLIGATORIOS
                const base3D = parseFloat(document.getElementById(suffix === 'Editar' ? 'base3DEditar' : 'base3D')?.value);
                const alturaInfo3D = parseFloat(document.getElementById(suffix === 'Editar' ? 'alturaInfo3DEditar' : 'alturaInfo3D')?.value);

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
                const alturaPlanas = parseFloat(document.getElementById(suffix === 'Editar' ? 'alturaPlanasEditar' : 'alturaPlanas')?.value);
                const materialPlanas = document.getElementById(suffix === 'Editar' ? 'materialPlanasEditar' : 'materialPlanas')?.value;
                
                // CAMPOS INFORMATIVOS AHORA OBLIGATORIOS
                const basePlanas = parseFloat(document.getElementById(suffix === 'Editar' ? 'basePlanasEditar' : 'basePlanas')?.value);
                const alturaInfoPlanas = parseFloat(document.getElementById(suffix === 'Editar' ? 'alturaInfoPlanasEditar' : 'alturaInfoPlanas')?.value);
                
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
                const calidadBanner = document.getElementById(suffix === 'Editar' ? 'calidadBannerEditar' : 'calidadBanner')?.value;
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
                const areaCircular = parseFloat(document.getElementById(`areaCircular${suffix === 'Editar' ? 'Editar' : ''}`)?.value);
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

            case "11": // Caja de Doble Vista
                const baseDobleVista = document.getElementById(`baseDobleVista${suffix}`);
                const alturaDobleVista = document.getElementById(`alturaDobleVista${suffix}`);
                
                if (!baseDobleVista || !baseDobleVista.value || !alturaDobleVista || !alturaDobleVista.value) {
                    Helpers.mostrarMensaje("Ingrese base y altura para caja de doble vista", "error");
                    return null;
                }
                
                const baseDoble = parseFloat(baseDobleVista.value) || 0;
                const alturaDoble = parseFloat(alturaDobleVista.value) || 0;
                const perimetro = baseDoble + alturaDoble;
                
                producto.descripcion = "Caja de Doble Vista";
                
                if (perimetro <= 80) {
                    producto.precio = perimetro * 45;
                    producto.medidas = `${baseDoble}cm + ${alturaDoble}cm = ${perimetro}cm (≤80cm)`;
                } else {
                    producto.precio = (perimetro * 45) + 2500;
                    producto.medidas = `${baseDoble}cm + ${alturaDoble}cm = ${perimetro}cm (>80cm +$2,500)`;
                }
                break;

            default:
                Helpers.mostrarMensaje("Seleccione un tipo de producto válido", "error");
                return null;
        }

        if (producto && producto.precio) {
            // IMPORTANTE: Guardar precio base ANTES de calcular viáticos
            producto.precioBase = producto.precio;
            console.log(`💾 Precio base guardado: $${producto.precioBase} para ${producto.descripcion}`);
            
            // Calcular precio con viáticos
            const precioConViaticos = this.calcularPrecioConViaticos(producto.precio);
            const viaticoPorProducto = precioConViaticos - producto.precio;
            
            // Actualizar precio final
            producto.precio = precioConViaticos;
            
            // Agregar info de viático en medidas si aplica
            if (viaticoPorProducto > 0) {
                producto.medidas += ` (incluye $${viaticoPorProducto.toFixed(2)} viático)`;
                console.log(`💰 Viático agregado: +$${viaticoPorProducto.toFixed(2)}`);
            }
            
            console.log(`✅ Producto final: ${producto.descripcion} = $${producto.precio}`);
        }

        return producto;
    }

    agregarProducto(producto) {
        this.productos.push(producto);
        console.log(`✅ Producto agregado. Total productos: ${this.productos.length}`);
        
        // Recalcular viáticos de TODOS los productos
        this.recalcularViaticos();
        
        this.actualizarTabla();
        this.actualizarTotales();
    }

    eliminarProducto(index) {
        this.productos.splice(index, 1);
        console.log(`🗑️ Producto eliminado. Total productos: ${this.productos.length}`);
        
        // Recalcular viáticos después de eliminar
        this.recalcularViaticos();
        
        this.actualizarTabla();
        this.actualizarTotales();
    }

    recalcularViaticos() {
        const zona = document.getElementById('zonaServicio')?.value;
        console.log(`🔄 Recalculando viáticos. Zona: ${zona}, Productos: ${this.productos.length}`);
        
        if (this.productos.length === 0) return;
        
        if (zona === 'cdmx') {
            // CDMX: $1000 fijos distribuidos entre productos
            const viaticoPorProducto = 1000 / this.productos.length;
            console.log(`💰 Viático CDMX por producto: $${viaticoPorProducto.toFixed(2)}`);
            
            this.productos.forEach((producto, index) => {
                if (!producto.precioBase) {
                    producto.precioBase = producto.precio;
                    console.log(`⚠️ PrecioBase faltante, usando precio actual: $${producto.precioBase}`);
                }
                
                // Remover texto de viático anterior
                producto.medidas = producto.medidas.replace(/ \(incluye \$[\d.,]+ viático.*?\)/, '');
                
                // Aplicar nuevo viático CDMX
                producto.precio = producto.precioBase + viaticoPorProducto;
                producto.medidas += ` (incluye $${viaticoPorProducto.toFixed(2)} viático CDMX)`;
                
                console.log(`  📦 Producto ${index + 1}: $${producto.precioBase.toFixed(2)} + $${viaticoPorProducto.toFixed(2)} = $${producto.precio.toFixed(2)}`);
            });
            
        } else if (zona === 'otro') {
            // Otro estado: viáticos por kilómetros
            const kilometros = parseFloat(document.getElementById('kilometros')?.value) || 0;
            
            if (kilometros > 0) {
                const viaticoTotal = kilometros * 20;
                const viaticoPorProducto = viaticoTotal / this.productos.length;
                console.log(`🛣️ Viático por km: ${kilometros}km × $20 = $${viaticoTotal}, por producto: $${viaticoPorProducto.toFixed(2)}`);
                
                this.productos.forEach((producto, index) => {
                    if (!producto.precioBase) {
                        producto.precioBase = producto.precio;
                        console.log(`⚠️ PrecioBase faltante, usando precio actual: $${producto.precioBase}`);
                    }
                    
                    // Remover texto de viático anterior
                    producto.medidas = producto.medidas.replace(/ \(incluye \$[\d.,]+ viático.*?\)/, '');
                    
                    // Aplicar nuevo viático por kilómetros
                    producto.precio = producto.precioBase + viaticoPorProducto;
                    producto.medidas += ` (incluye $${viaticoPorProducto.toFixed(2)} viático ${kilometros}km)`;
                    
                    console.log(`  📦 Producto ${index + 1}: $${producto.precioBase.toFixed(2)} + $${viaticoPorProducto.toFixed(2)} = $${producto.precio.toFixed(2)}`);
                });
            } else {
                // Sin kilómetros especificados, remover viáticos
                console.log('🚫 Sin kilómetros especificados, removiendo viáticos');
                this.productos.forEach((producto, index) => {
                    if (producto.precioBase) {
                        producto.medidas = producto.medidas.replace(/ \(incluye \$[\d.,]+ viático.*?\)/, '');
                        producto.precio = producto.precioBase;
                        console.log(`  📦 Producto ${index + 1}: viático removido, precio: $${producto.precio.toFixed(2)}`);
                    }
                });
            }
        }
    }

    calcularPrecioConViaticos(precioBase) {
        const zona = document.getElementById('zonaServicio')?.value;
        
        if (zona === 'cdmx') {
            // CDMX: $1000 distribuidos entre productos
            const totalProductosActual = this.productos.length + 1;
            const viaticoPorProducto = 1000 / totalProductosActual;
            console.log(`💰 Viático CDMX calculado: $${viaticoPorProducto.toFixed(2)} (${totalProductosActual} productos)`);
            return precioBase + viaticoPorProducto;
        } else if (zona === 'otro') {
            // Otro estado: viáticos por kilómetros
            const kilometros = parseFloat(document.getElementById('kilometros')?.value) || 0;
            if (kilometros > 0) {
                const viaticoTotal = kilometros * 20;
                const totalProductosActual = this.productos.length + 1;
                const viaticoPorProducto = viaticoTotal / totalProductosActual;
                console.log(`🛣️ Viático km calculado: ${kilometros}km × $20 = $${viaticoTotal}, por producto: $${viaticoPorProducto.toFixed(2)}`);
                return precioBase + viaticoPorProducto;
            }
        }
        
        return precioBase;
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

    limpiarFormulario(esEdicion = false) {
        const suffix = esEdicion ? 'Editar' : '';
        
        // ❌ PROBLEMA: Esto limpia TODO (incluyendo cliente y zona)
        // const inputs = document.querySelectorAll(`input${suffix ? `[id$="${suffix}"]` : ':not([id*="Editar"])'}`);
        
        // ✅ SOLUCIÓN: Solo limpiar campos específicos de productos
        const camposProducto = [
            'base', 'altura', 'grosor', 'cantidad', 'cantidadPlanas',
            'descripcionOtro', 'costoOtro', 'diametroCircular',
            'baseDobleVista', 'alturaDobleVista', 'areaCircular',
            'altura3D', 'base3D', 'alturaInfo3D', 'alturaPlanas', 
            'basePlanas', 'alturaInfoPlanas'
        ];
        
        camposProducto.forEach(campo => {
            const input = document.getElementById(`${campo}${suffix}`);
            if (input) {
                input.value = '';
            }
        });
        
        // Limpiar selects de productos (NO cliente ni zona)
        const selectsProducto = [
            'categoriaProducto', 'tipoProducto', 'tipoNeon', 'calidadLona',
            'calidadVinil', 'calidadBanner', 'material3D', 'materialPlanas'
        ];
        
        selectsProducto.forEach(select => {
            const elemento = document.getElementById(`${select}${suffix}`);
            if (elemento) {
                elemento.value = '';
            }
        });
        
        // IMPORTANTE: Ocultar todos los campos específicos
        const formManager = window.CotizacionApp?.formManager;
        if (formManager) {
            formManager.ocultarTodosLosCampos(esEdicion);
        }
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

    calcularPrecioFinal(precioBase) {
        const zona = document.getElementById('zonaServicio')?.value;
        const totalProductos = this.productos.length + 1; // +1 por el producto actual
        
        let viatico = 0;
        if (zona === 'cdmx') {
            viatico = 1000 / totalProductos; // Distribuir $1000 entre productos
        }
        
        return precioBase + viatico;
    }

    // ✅ MÉTODO FALTANTE: actualizarTabla
    actualizarTabla() {
        console.log('🔄 Actualizando tabla de productos...');
        this.actualizarListaHTML();
    }

    // ✅ MÉTODO MEJORADO: actualizarTotales con validación
    actualizarTotales() {
        console.log('💰 Actualizando totales...');
        
        // Verificar si quoteGenerator existe y tiene productManager configurado
        if (window.CotizacionApp?.quoteGenerator) {
            // Asegurarse de que el quoteGenerator tenga la referencia al productManager
            if (!window.CotizacionApp.quoteGenerator.productManager) {
                console.warn('⚠️ QuoteGenerator no tiene ProductManager configurado, configurando...');
                window.CotizacionApp.quoteGenerator.setProductManager(this);
            }
            
            try {
                window.CotizacionApp.quoteGenerator.actualizarTotales();
            } catch (error) {
                console.error('❌ Error al actualizar totales con QuoteGenerator:', error);
                // Fallback al método básico
                this.actualizarTotalesBasico();
            }
        } else {
            // Fallback: actualizar solo el total básico
            this.actualizarTotalesBasico();
        }
    }

    // ✅ MÉTODO AUXILIAR: fallback para totales básicos
    actualizarTotalesBasico() {
        const total = this.calcularTotal();
        console.log(`📊 Total básico calculado: $${total.toFixed(2)}`);
        
        // Buscar elemento de total y actualizar si existe
        const totalElement = document.querySelector('.total-productos, #totalFinal');
        if (totalElement) {
            totalElement.innerHTML = `<strong>Total: $${total.toFixed(2)} MXN</strong>`;
        }
    }

    // ✅ MÉTODO ADICIONAL: calcularSubtotal (requerido por quote-generator)
    calcularSubtotal() {
        return this.calcularTotal(); // Alias para compatibilidad
    }
}