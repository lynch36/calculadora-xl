// Cotización básica rápida
DevScripts.testSimple()

// Cotización completa IO 2025 (11 productos)
DevScripts.recrearCotizacionIO2025()

// Testing y debugging
DevScripts.debugearElementos()
DevScripts.investigarSistemaEdicion()

// Casos específicos - Agregar productos individuales
DevScripts.agregarProductoConCategoriaReal('cajas', '1', {base: 120, altura: 240})     // Caja acrílico
DevScripts.agregarProductoConCategoriaReal('cajas', '2', {base: 240, altura: 120})     // Caja lona
DevScripts.agregarProductoConCategoriaReal('neon', '3', {base: 90, altura: 90, tipoNeon: '1'})  // Neón normal
DevScripts.agregarProductoConCategoriaReal('neon', '3', {base: 90, altura: 90, tipoNeon: '2'})  // Neón 2.0
DevScripts.agregarProductoConCategoriaReal('impresion', '4', {base: 120, altura: 240, calidadLona: '3'})  // Lona UV
DevScripts.agregarProductoConCategoriaReal('impresion', '5', {base: 240, altura: 120, calidadVinil: '3'}) // Vinil UV
DevScripts.agregarProductoConCategoriaReal('letras', '6', {altura3D: 300, material3D: '4', base3D: 120, alturaInfo3D: 240}) // Letras 3D
DevScripts.agregarProductoConCategoriaReal('letras', '7', {alturaPlanas: 150, materialPlanas: '1', basePlanas: 120, alturaInfoPlanas: 240}) // Letras planas
DevScripts.agregarProductoConCategoriaReal('banner', '8', {base: 120, altura: 240, calidadBanner: '1'})  // Banner
DevScripts.agregarProductoConCategoriaReal('cajas', '9', {areaCircular: 50})           // Caja circular
DevScripts.agregarProductoConCategoriaReal('otros', '10', {descripcionOtro: 'Producto personalizado', costoOtro: 800}) // Personalizado

// ==========================================
// EDICIÓN (MANUAL)
// ==========================================

// Editar solo cliente
DevScripts.editarSoloCliente()

// Editar cotización completa (productos + cliente)
DevScripts.editarCotizacionIO2025Real()

// Reemplazar producto específico
DevScripts.reemplazarProducto(0, 'cajas', '1', {base: 160, altura: 300})

// ==========================================
// FLUJOS COMPLETOS (MANUAL)
// ==========================================

// Crear + Editar todo automáticamente
DevScripts.flujoCompletoIO()

// Utilidades
DevScripts.limpiarTodo()      // Limpiar todo
DevScripts.mostrarFormulario() // Mostrar formulario
DevScripts.mostrarAyuda()     // Ver ayuda completa

// ==========================================
// EJEMPLOS DE USO MANUAL:
// ==========================================

// Para cotización completa IO:
// DevScripts.recrearCotizacionIO2025()

// Para test básico:
// DevScripts.testSimple()

// Para editar después de crear:
// DevScripts.editarCotizacionIO2025Real()

// Para flujo completo:
// DevScripts.flujoCompletoIO()

// ==========================================
// EDICIÓN AVANZADA (NUEVO)
// ==========================================

// Edición avanzada completa (cambiar nombre + eliminar + agregar)
DevScripts.editarCotizacionIO2025Avanzada()

// Cambio rápido a IO3
DevScripts.cambiarAIO3Rapido()

// Funcion para IO4 directo
DevScripts.crearIO4Directo()

// Eliminar productos específicos
DevScripts.eliminarProductoPorIndice(5)     // Eliminar producto en posición 5
DevScripts.eliminarProductoPorIndice(0)     // Eliminar primer producto

// Edición personalizada con configuración específica
DevScripts.editarCotizacionPersonalizada({
    nuevoNombre: 'IO4',
    eliminarIndices: [1, 2, 3],
    nuevosProductos: [
        /* { categoria: 'neon', tipo: '3', config: { base: 150, altura: 150, tipoNeon: '2' } }, */
        { categoria: 'otros', tipo: '10', config: { descripcionOtro: 'Sistema LED Avanzado', costoOtro: 2500 } }
    ]
})

// ==========================================
// FLUJOS COMPLETOS AVANZADOS
// ==========================================

// Crear cotización IO original y luego editarla avanzadamente
// DevScripts.recrearCotizacionIO2025()
// setTimeout(() => DevScripts.editarCotizacionIO2025Avanzada(), 3000)

// Flujo completo a IO3
// DevScripts.recrearCotizacionIO2025()
// setTimeout(() => DevScripts.cambiarAIO3Rapido(), 3000)

// ==========================================
// DEBUG EDICIÓN (NUEVO)
// ==========================================

// Investigar formulario de edición
DevScripts.investigarFormularioEdicion()

// Guardar datos manualmente
DevScripts.guardarDatosCliente()

// ==========================================
// EDICIÓN CORREGIDA
// ==========================================

// Edición de cliente con guardado automático
DevScripts.editarSoloCliente()

// Test específico para IO4 con guardado correcto
DevScripts.editarCotizacionPersonalizada({
    nuevoNombre: 'IO4',
    empresa: 'IO4 EMPRESA NUEVA',
    eliminarIndices: [0, 1, 2],
    nuevosProductos: [
        { categoria: 'neon', tipo: '3', config: { base: 150, altura: 150, tipoNeon: '2' } },
        { categoria: 'otros', tipo: '10', config: { descripcionOtro: 'Sistema LED Avanzado', costoOtro: 2500 } }
    ]
})

// 1. Investigar qué botones hay disponibles
DevScripts.investigarFormularioEdicion()

// 2. Probar edición simple
DevScripts.editarSoloCliente()

// 3. Si no funciona, guardar manualmente después de cambiar datos
// (Primero ejecutar editarCotizacion() manualmente, cambiar datos y luego:)
DevScripts.guardarDatosCliente()

// ==========================================
// CREACIÓN DIRECTA DE VERSIONES IO
// ==========================================

// Crear versiones específicas directamente
DevScripts.crearIO4Directo()         // IO4 con Sistema LED
DevScripts.crearIO5Directo()         // IO5 Premium
DevScripts.crearIO6Minimalista()     // IO6 Minimalista

// Edición avanzada manual
DevScripts.editarCotizacionIO2025Avanzada()   // IO2 con eliminaciones y agregados
DevScripts.cambiarAIO3Rapido()                // IO3 Express

// ==========================================
// FUNCIONES INDIVIDUALES
// ==========================================

// Eliminar productos específicos
DevScripts.eliminarProductoPorIndice(0)
DevScripts.eliminarProductoPorIndice(5)
DevScripts.eliminarProductoPorIndice(10)

// ==========================================
// FLUJOS COMPLETOS DIRECTOS
// ==========================================

// Para crear cualquier versión IO directamente:
// DevScripts.crearIO4Directo()    // Crear IO4 completo
// DevScripts.crearIO5Directo()    // Crear IO5 completo  
// DevScripts.crearIO6Minimalista() // Crear IO6 completo

// ==========================================
// ELIMINACIÓN CORREGIDA (NUEVO)
// ==========================================

// Eliminar SOLO UN producto específico (función segura)
DevScripts.soloEliminarProducto(0)    // Eliminar solo el primer producto
DevScripts.soloEliminarProducto(1)    // Eliminar solo el segundo producto
DevScripts.soloEliminarProducto(2)    // Eliminar solo el tercer producto

// Eliminar múltiples productos (automáticamente ordenados)
DevScripts.editarCotizacionPersonalizada({
    nuevoNombre: 'IO4',
    eliminarIndices: [2, 1, 0]  // Se ordenarán automáticamente como [2, 1, 0]
})

// ==========================================
// EJEMPLOS CORREGIDOS PARA IO4
// ==========================================

// IO4 - Eliminar solo primer producto
DevScripts.editarCotizacionPersonalizada({
    nuevoNombre: 'IO4',
    eliminarIndices: [0]  // Solo eliminar el primer producto
})

// IO4 - Eliminar primeros 3 productos
DevScripts.editarCotizacionPersonalizada({
    nuevoNombre: 'IO4',
    eliminarIndices: [0, 1, 2],  // Automáticamente se procesarán como [2, 1, 0]
    nuevosProductos: [
        { categoria: 'neon', tipo: '3', config: { base: 150, altura: 150, tipoNeon: '2' } },
        { categoria: 'otros', tipo: '10', config: { descripcionOtro: 'Sistema LED Avanzado', costoOtro: 2500 } }
    ]
})

// IO4 - Eliminar productos específicos (no consecutivos)
DevScripts.editarCotizacionPersonalizada({
    nuevoNombre: 'IO4',
    eliminarIndices: [0, 1, 2],  // Eliminar productos en posiciones 5, 8 y 10
    nuevosProductos: [
        { categoria: 'cajas', tipo: '1', config: { base: 200, altura: 300 } }
    ]
})

// ==========================================
// FUNCIÓN CORREGIDA (NUEVO)
// ==========================================

// Guardar datos del cliente manualmente
DevScripts.guardarDatosCliente()

// Edición corregida de IO4
DevScripts.editarCotizacionPersonalizada({
    nuevoNombre: 'IO4',
    eliminarIndices: [0,1,2]  // Solo eliminar primer producto
})

// ==========================================
// FUNCIONES DE ELIMINACIÓN SEGURAS
// ==========================================

// Eliminar solo UN producto específico
DevScripts.soloEliminarProducto(0)    // Función más segura
DevScripts.soloEliminarProducto(1)
DevScripts.soloEliminarProducto(2)

// ==========================================
// DEBUG AGREGADO DE PRODUCTOS (NUEVO)
// ==========================================

// Debug estado después de eliminar
DevScripts.debugEstadoDespuesDeEliminar()

// Test específico para agregar productos después de eliminar
DevScripts.editarCotizacionPersonalizada({
    nuevoNombre: 'IO4-TEST',
    eliminarIndices: [0, 1, 2],
    nuevosProductos: [
        { categoria: 'cajas', tipo: '1', config: { base: 200, altura: 300 } }
    ]
})

// Test más simple - solo agregar sin eliminar
DevScripts.editarCotizacionPersonalizada({
    nuevoNombre: 'IO4-SIMPLE', 
    nuevosProductos: [
        { categoria: 'cajas', tipo: '1', config: { base: 150, altura: 250 } },
        { categoria: 'neon', tipo: '3', config: { base: 100, altura: 100, tipoNeon: '1' } }
    ]
})

// CORREGIDA - Edición personalizada con manejo robusto de índices
async editarCotizacionPersonalizadaRobusta(config = {}) {
    console.log('✏️ Edición personalizada robusta...');
    
    const defaultConfig = {
        nuevoNombre: 'IO2',
        empresa: 'IO2 EMPRESA',
        eliminarIndices: [],
        modificarProductos: [],
        nuevosProductos: []
    };
    
    const finalConfig = { ...defaultConfig, ...config };
    
    try {
        // 1. CAMBIAR NOMBRE DEL CLIENTE PRIMERO
        if (finalConfig.nuevoNombre) {
            console.log(`1. Cambiando nombre a "${finalConfig.nuevoNombre}"...`);
            
            if (typeof editarCotizacion === 'function') {
                editarCotizacion();
                await new Promise(resolve => setTimeout(resolve, 400));
                
                const elemento = document.getElementById('clienteNombre');
                if (elemento) {
                    elemento.value = finalConfig.nuevoNombre;
                    elemento.dispatchEvent(new Event('change'));
                    elemento.dispatchEvent(new Event('input'));
                }
                
                if (finalConfig.empresa) {
                    const elementoEmpresa = document.getElementById('clienteEmpresa');
                    if (elementoEmpresa) {
                        elementoEmpresa.value = finalConfig.empresa;
                        elementoEmpresa.dispatchEvent(new Event('change'));
                        elementoEmpresa.dispatchEvent(new Event('input'));
                    }
                }
                
                await this.guardarDatosCliente();
                await new Promise(resolve => setTimeout(resolve, 800)); // Esperar más tiempo
                console.log('✅ Datos del cliente actualizados');
            }
        }

        // 2. RESETEAR FORMULARIO ANTES DE ELIMINAR
        console.log('2. Reseteando formulario...');
        this.resetearFormularioProductos();
        await new Promise(resolve => setTimeout(resolve, 300));

        // 3. ELIMINAR PRODUCTOS (DE MAYOR A MENOR ÍNDICE)
        if (finalConfig.eliminarIndices && finalConfig.eliminarIndices.length > 0) {
            console.log('3. Eliminando productos de forma robusta...');
            
            // Verificar productos actuales ANTES de eliminar
            let productosActuales = document.querySelectorAll('button[onclick*="eliminarProducto"]');
            console.log(`Productos disponibles: ${productosActuales.length}`);
            
            // Filtrar índices válidos y ordenar de mayor a menor
            const indicesValidos = finalConfig.eliminarIndices
                .filter(indice => indice < productosActuales.length)
                .sort((a, b) => b - a);
                
            console.log(`Eliminando en orden: [${indicesValidos.join(', ')}]`);
            
            for (const indice of indicesValidos) {
                console.log(`🗑️ Eliminando producto ${indice}...`);
                
                // RE-OBTENER botones antes de cada eliminación
                const botonesActuales = document.querySelectorAll('button[onclick*="eliminarProducto"]');
                
                if (indice < botonesActuales.length) {
                    botonesActuales[indice].click();
                    await new Promise(resolve => setTimeout(resolve, 500)); // Esperar más tiempo
                    
                    // Verificar que se eliminó
                    const botonesFinales = document.querySelectorAll('button[onclick*="eliminarProducto"]');
                    console.log(`  ✅ Eliminado. Productos restantes: ${botonesFinales.length}`);
                } else {
                    console.warn(`  ⚠️ Índice ${indice} ya no existe`);
                }
            }
            
            console.log('✅ Eliminación completada');
        }

        // 4. ESPERAR Y RESETEAR FORMULARIO NUEVAMENTE
        console.log('4. Preparando para agregar productos...');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar más tiempo
        this.resetearFormularioProductos();
        await new Promise(resolve => setTimeout(resolve, 500));

        // 5. AGREGAR NUEVOS PRODUCTOS CON VERIFICACIÓN
        if (finalConfig.nuevosProductos && finalConfig.nuevosProductos.length > 0) {
            console.log('5. Agregando nuevos productos...');
            
            for (let i = 0; i < finalConfig.nuevosProductos.length; i++) {
                const nuevo = finalConfig.nuevosProductos[i];
                console.log(`\n5.${i+1} Agregando: ${nuevo.categoria} tipo ${nuevo.tipo}...`);
                
                try {
                    // Verificar que el formulario esté listo
                    const categoriaSelect = document.getElementById('categoriaProducto');
                    const tipoSelect = document.getElementById('tipoProducto');
                    
                    if (!categoriaSelect || !tipoSelect) {
                        console.error('❌ Formulario no disponible, saltando producto');
                        continue;
                    }
                    
                    // Resetear antes de cada producto
                    this.resetearFormularioProductos();
                    await new Promise(resolve => setTimeout(resolve, 300));
                    
                    const exito = await this.agregarProductoConCategoriaReal(nuevo.categoria, nuevo.tipo, nuevo.config);
                    
                    if (exito) {
                        console.log(`  ✅ Producto ${i+1} agregado`);
                    } else {
                        console.error(`  ❌ Error agregando producto ${i+1}`);
                    }
                    
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar más tiempo entre productos
                    
                } catch (error) {
                    console.error(`❌ Error con producto ${i+1}:`, error);
                }
            }
        }

        // 6. VERIFICACIÓN FINAL
        const productosFinales = document.querySelectorAll('button[onclick*="eliminarProducto"]');
        console.log(`\n✅ Edición completada. Productos finales: ${productosFinales.length}`);
        
        return true;
        
    } catch (error) {
        console.error('❌ Error en edición robusta:', error);
        return false;
    }
},

// NUEVA FUNCIÓN - Resetear formulario de productos
resetearFormularioProductos() {
    console.log('🔄 Reseteando formulario de productos...');
    
    try {
        // Resetear selects principales
        const categoriaSelect = document.getElementById('categoriaProducto');
        const tipoSelect = document.getElementById('tipoProducto');
        
        if (categoriaSelect) {
            categoriaSelect.value = '';
            categoriaSelect.dispatchEvent(new Event('change'));
        }
        
        if (tipoSelect) {
            tipoSelect.innerHTML = '<option value="">Seleccione el tipo...</option>';
            tipoSelect.value = '';
        }
        
        // Ocultar subcategorías
        const subcategorias = document.getElementById('subcategorias');
        if (subcategorias) subcategorias.style.display = 'none';
        
        // Limpiar campos específicos
        const campos = [
            'base', 'altura', 'areaCircular', 'altura3D', 'alturaPlanas',
            'base3D', 'alturaInfo3D', 'basePlanas', 'alturaInfoPlanas',
            'descripcionOtro', 'costoOtro'
        ];
        
        campos.forEach(campo => {
            const elemento = document.getElementById(campo);
            if (elemento) elemento.value = '';
        });
        
        // Resetear selects específicos
        const selects = [
            'tipoNeon', 'calidadLona', 'calidadVinil', 
            'material3D', 'materialPlanas', 'calidadBanner'
        ];
        
        selects.forEach(select => {
            const elemento = document.getElementById(select);
            if (elemento) elemento.selectedIndex = 0;
        });
        
        // Ocultar todos los campos específicos
        const camposOpcionales = [
            'medidas', 'opcionesNeon', 'opcionesLona', 'opcionesVinil',
            'opcionesLetras3D', 'opcionesLetrasPlanas', 'opcionesBanner',
            'opcionesCircular', 'otroProducto'
        ];
        
        camposOpcionales.forEach(campo => {
            const elemento = document.getElementById(campo);
            if (elemento) elemento.style.display = 'none';
        });
        
        console.log('✅ Formulario reseteado');
        
    } catch (error) {
        console.error('❌ Error reseteando formulario:', error);
    }
},

// NUEVA FUNCIÓN - Validar estado del formulario
validarEstadoFormulario() {
    console.log('🔍 Validando estado del formulario...');
    
    const elementos = [
        'categoriaProducto',
        'tipoProducto', 
        'subcategorias',
        'listaProductos'
    ];
    
    let todosDisponibles = true;
    
    elementos.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            console.log(`✅ ${id}: disponible`);
            if (elemento.tagName === 'SELECT') {
                console.log(`   Valor actual: "${elemento.value}"`);
            }
        } else {
            console.error(`❌ ${id}: NO disponible`);
            todosDisponibles = false;
        }
    });
    
    const productosActuales = document.querySelectorAll('button[onclick*="eliminarProducto"]');
    console.log(`📋 Productos actuales: ${productosActuales.length}`);
    
    return todosDisponibles;
},

// FUNCIÓN DE DEBUG ESPECÍFICA
async debugEstadoCompleto() {
    console.log('🔍 Debug estado completo...');
    
    console.log('\n1. Estado del formulario:');
    this.validarEstadoFormulario();
    
    console.log('\n2. Productos actuales:');
    const productos = document.querySelectorAll('button[onclick*="eliminarProducto"]');
    productos.forEach((btn, i) => {
        console.log(`  ${i}. ${btn.getAttribute('onclick')}`);
    });
    
    console.log('\n3. Test de agregado simple:');
    try {
        const exito = await this.agregarProductoConCategoriaReal('cajas', '1', {base: 100, altura: 200});
        console.log(`   Resultado: ${exito ? 'ÉXITO' : 'FALLO'}`);
    } catch (error) {
        console.error('   Error:', error.message);
    }
},

// ==========================================
// EDICIÓN ROBUSTA (CORREGIDA)
// ==========================================

// Usar la función robusta en lugar de la problemática
DevScripts.editarCotizacionPersonalizadaRobusta({
    nuevoNombre: 'IO4',
    eliminarIndices: [0, 1, 2],
    nuevosProductos: [
        { categoria: 'cajas', tipo: '1', config: { base: 200, altura: 300 } },
        { categoria: 'neon', tipo: '3', config: { base: 150, altura: 150, tipoNeon: '2' } },
        { categoria: 'otros', tipo: '10', config: { descripcionOtro: 'Sistema LED Avanzado', costoOtro: 2500 } }
    ]
})

// ==========================================
// FUNCIONES DE DEBUG ROBUSTAS
// ==========================================

// Debug estado completo
DevScripts.debugEstadoCompleto()

// Validar formulario
DevScripts.validarEstadoFormulario()

// Resetear formulario manualmente
DevScripts.resetearFormularioProductos()

// ==========================================
// TESTS PASO A PASO
// ==========================================

// Test 1: Solo eliminar
DevScripts.editarCotizacionPersonalizadaRobusta({
    nuevoNombre: 'IO4-SOLO-ELIMINAR',
    eliminarIndices: [0, 1, 2]
})

// Test 2: Solo agregar (sin eliminar)
DevScripts.editarCotizacionPersonalizadaRobusta({
    nuevoNombre: 'IO4-SOLO-AGREGAR',
    nuevosProductos: [
        { categoria: 'cajas', tipo: '1', config: { base: 180, altura: 280 } }
    ]
})

// Test 3: Eliminar y agregar (completo)
DevScripts.editarCotizacionPersonalizadaRobusta({
    nuevoNombre: 'IO4-COMPLETO',
    eliminarIndices: [0, 1],
    nuevosProductos: [
        { categoria: 'cajas', tipo: '1', config: { base: 200, altura: 300 } },
        { categoria: 'neon', tipo: '3', config: { base: 120, altura: 120, tipoNeon: '2' } }
    ]
})

// Test con eliminación
DevScripts.editarCotizacionPersonalizada({
    nuevoNombre: 'IO4',
    eliminarIndices: [0, 1, 2]
})

// O usar la función robusta
DevScripts.editarCotizacionPersonalizadaRobusta({
    nuevoNombre: 'IO4',
    eliminarIndices: [0, 1, 2],
    nuevosProductos: [
        { categoria: 'cajas', tipo: '1', config: { base: 200, altura: 300 } }
    ]
})

// O crear IO4 directamente
DevScripts.crearIO4Directo()