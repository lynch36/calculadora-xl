// Scripts de desarrollo para testing rápido
const DevScripts = {
    // 1. FUNCIONES BÁSICAS PRIMERO
    
    // MOVER ESTA FUNCIÓN AL PRINCIPIO - Forzar actualización completa (función base)
    forzarActualizacionCompleta() {
        console.log('🔄 Forzando actualización usando funciones reales de la app...');
        
        try {
            // 1. USAR LA FUNCIÓN REAL: generarCotizacionDesdeForm()
            if (typeof generarCotizacionDesdeForm === 'function') {
                console.log('✅ Usando generarCotizacionDesdeForm() para actualizar...');
                generarCotizacionDesdeForm();
                console.log('✅ Cotización regenerada - lista actualizada');
                return true;
            }
            
            // 2. Backup: Forzar re-render del DOM
            const listaProductos = document.getElementById('listaProductos');
            if (listaProductos) {
                console.log('🔄 Forzando re-render de listaProductos...');
                
                // Trigger reflow forzado
                listaProductos.style.display = 'none';
                listaProductos.offsetHeight; // Force reflow
                listaProductos.style.display = '';
                
                // Dispatch events
                listaProductos.dispatchEvent(new Event('change'));
                listaProductos.dispatchEvent(new Event('update'));
                
                console.log('✅ listaProductos actualizado');
            }
            
            // 3. Disparar eventos personalizados
            const eventos = ['productoAgregado', 'listaActualizada'];
            eventos.forEach(evento => {
                document.dispatchEvent(new CustomEvent(evento, { 
                    detail: { timestamp: Date.now() }
                }));
            });
            
            console.log('✅ Actualización completa ejecutada');
            return true;
            
        } catch (error) {
            console.error('❌ Error forzando actualización completa:', error);
            return false;
        }
    },

    // FUNCIÓN HELPER - Contar productos reales 
    contarProductosReales() {
        try {
            // Método 1: Usar ProductManager si existe
            if (window.app?.productManager?.productos) {
                const productosEnManager = window.app.productManager.productos.length;
                return productosEnManager;
            }
            
            // Método 2: Contar botones únicos (filtrar duplicados)
            const todosBotones = document.querySelectorAll('button[onclick*="eliminarProducto"]');
            const indicesUnicos = new Set();
            
            todosBotones.forEach(btn => {
                const onclick = btn.getAttribute('onclick');
                const match = onclick.match(/eliminarProducto\((\d+)\)/);
                if (match) {
                    indicesUnicos.add(parseInt(match[1]));
                }
            });
            
            return indicesUnicos.size;
            
        } catch (error) {
            console.error('❌ Error contando productos:', error);
            return 0;
        }
    },

    // 2. FUNCIÓN PRINCIPAL
    // Función básica que funciona (MANTENER COMO ESTÁ, pero sin duplicar forzarActualizacionCompleta)
    async agregarProductoConCategoriaReal(categoria, tipo, config = {}) {
        console.log(`🎯 Agregando ${categoria} -> tipo ${tipo}...`);
        
        try {
            // 1. Contar productos antes
            const productosAntes = this.contarProductosReales();
            console.log(`📊 Productos antes: ${productosAntes}`);
            
            // 2. Configurar formulario
            const categoriaSelect = document.getElementById('categoriaProducto');
            categoriaSelect.value = categoria;
            categoriaSelect.dispatchEvent(new Event('change'));
            
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const tipoSelect = document.getElementById('tipoProducto');
            tipoSelect.value = tipo;
            tipoSelect.dispatchEvent(new Event('change'));
            
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // 3. Llenar configuración
            Object.keys(config).forEach(campo => {
                const elemento = document.getElementById(campo);
                if (elemento) {
                    elemento.value = config[campo];
                    elemento.dispatchEvent(new Event('input'));
                    elemento.dispatchEvent(new Event('change'));
                    console.log(`✅ ${campo} = ${config[campo]}`);
                }
            });
            
            // 4. Agregar producto
            if (typeof agregarProducto === 'function') {
                agregarProducto();
                console.log('✅ agregarProducto() ejecutada');
                
                // 5. USAR ACTUALIZACIÓN REAL
                await new Promise(resolve => setTimeout(resolve, 300));
                
                // Forzar actualización usando la función real de tu app
                this.forzarActualizacionCompleta();
                
                // 6. Verificar que se agregó
                await new Promise(resolve => setTimeout(resolve, 200));
                const productosDespues = this.contarProductosReales();
                console.log(`📊 Productos después: ${productosDespues}`);
                
                if (productosDespues > productosAntes) {
                    console.log('✅ Producto agregado y verificado');
                    return true;
                } else {
                    console.log('✅ Producto agregado (actualización en progreso)');
                    
                    // Segunda actualización si es necesario
                    setTimeout(() => {
                        this.forzarActualizacionCompleta();
                    }, 500);
                    
                    return true;
                }
                
            } else {
                console.error('❌ Función agregarProducto no encontrada');
                return false;
            }
            
        } catch (error) {
            console.error('❌ Error:', error);
            return false;
        }
    },

    // 3. FUNCIONES HELPER
    // Funciones helper síncronas (sin await)
    limpiarTodo() {
        if (window.app?.productManager?.productos) {
            window.app.productManager.productos.length = 0;
            window.app.productManager.actualizarListaHTML();
        }
        
        const campos = ['clienteNombre', 'clienteEmpresa', 'clienteContacto'];
        campos.forEach(id => {
            const elemento = document.getElementById(id);
            if (elemento) elemento.value = '';
        });
        
        const checkboxes = ['requiereFactura', 'requiereInstalacion'];
        checkboxes.forEach(id => {
            const elemento = document.getElementById(id);
            if (elemento) elemento.checked = false;
        });
        
        console.log('🧹 Todo limpiado');
    },

    mostrarFormulario() {
        const form = document.getElementById('cotizacionForm');
        if (form) {
            form.style.display = 'block';
            console.log('📝 Formulario mostrado');
        }
    },

    // Debuggear elementos (síncrono)
    debugearElementos() {
        console.log('🔍 Debugging elementos existentes...');
        
        const elementos = [
            'categoriaProducto',
            'tipoProducto', 
            'subcategorias',
            'cotizacionForm',
            'clienteNombre'
        ];
        
        elementos.forEach(id => {
            const elemento = document.getElementById(id);
            if (elemento) {
                console.log(`✅ ${id} existe:`, elemento.tagName);
                if (elemento.tagName === 'SELECT') {
                    console.log(`   Opciones: [${Array.from(elemento.options).map(o => `"${o.value}"`).join(', ')}]`);
                }
            } else {
                console.log(`❌ ${id} NO existe`);
            }
        });
    },

    // 4. FUNCIONES COMPLEJAS
    // Cotización completa
    async recrearCotizacionIO2025() {
        console.log('🔄 Recreando cotización IO 2025-11-23 (actualizada)...');
        
        this.limpiarTodo();
        this.mostrarFormulario();
        
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Configurar cliente
        document.getElementById('clienteNombre').value = 'IO - Cliente 2025';
        const facturaCheck = document.getElementById('requiereFactura');
        const instalacionCheck = document.getElementById('requiereInstalacion');
        if (facturaCheck) facturaCheck.checked = true;
        if (instalacionCheck) instalacionCheck.checked = true;
        
        try {
            console.log('1/11 Agregando Caja de Acrílico (120x240cm)...');
            await this.agregarProductoConCategoriaReal('cajas', '1', {
                'base': 120,
                'altura': 240
            });
            await new Promise(resolve => setTimeout(resolve, 400));
            
            console.log('2/11 Agregando Caja de Lona (240x120cm)...');
            await this.agregarProductoConCategoriaReal('cajas', '2', {
                'base': 240,
                'altura': 120
            });
            await new Promise(resolve => setTimeout(resolve, 400));
            
            console.log('3/11 Agregando Caja Circular (área 500cm²)...');
            await this.agregarProductoConCategoriaReal('cajas', '9', {
                'areaCircular': 500  // área directa, no diámetro
            });
            await new Promise(resolve => setTimeout(resolve, 400));
            
            console.log('4/11 Agregando Caja de Doble Vista (50x40cm)...');
            await this.agregarProductoConCategoriaReal('cajas', '11', {
                'baseDobleVista': 50,
                'alturaDobleVista': 40
            });
            await new Promise(resolve => setTimeout(resolve, 400));
            
            console.log('5/11 Agregando Neón Normal (90x90cm)...');
            await this.agregarProductoConCategoriaReal('neon', '3', {
                'base': 90,
                'altura': 90,
                'tipoNeon': '1'
            });
            await new Promise(resolve => setTimeout(resolve, 400));
            
            console.log('6/11 Agregando Neón 2.0 (100x100cm)...');
            await this.agregarProductoConCategoriaReal('neon', '3', {
                'base': 100,
                'altura': 100,
                'tipoNeon': '2'
            });
            await new Promise(resolve => setTimeout(resolve, 400));
            
            console.log('7/11 Agregando Impresión Lona UV (120x240cm)...');
            await this.agregarProductoConCategoriaReal('impresion', '4', {
                'base': 120,
                'altura': 240,
                'calidadLona': '3' // UV Resistente $340/m²
            });
            await new Promise(resolve => setTimeout(resolve, 400));
            
            console.log('8/11 Agregando Impresión Vinil UV 3M (240x120cm)...');
            await this.agregarProductoConCategoriaReal('impresion', '5', {
                'base': 240,
                'altura': 120,
                'calidadVinil': '4' // UV 3M Premium $640/m²
            });
            await new Promise(resolve => setTimeout(resolve, 400));
            
            console.log('9/11 Agregando Letras 3D Acrílico con luz...');
            await this.agregarProductoConCategoriaReal('letras', '6', {
                'altura3D': 15,           // altura para cotización
                'material3D': '1',        // Acrílico con luz
                'base3D': 120,           // medida informativa
                'alturaInfo3D': 15       // medida informativa
            });
            
            console.log('10/11 Agregando Banner Alta Calidad (120x240cm)...');
            await this.agregarProductoConCategoriaReal('banner', '8', {
                'base': 120,
                'altura': 240,
                'calidadBanner': '2' // Alta Calidad $900/m²
            });
            
            console.log('11/11 Agregando Producto Personalizado...');
            await this.agregarProductoConCategoriaReal('otros', '10', {
                'descripcionOtro': 'Sistema LED Personalizado',
                'costoOtro': 1500
            });
            await new Promise(resolve => setTimeout(resolve, 400));
            
            console.log('✅ Todos los 11 productos agregados exitosamente!');
            console.log('📋 Cotización IO 2025 completa:');
            console.log('   • Cajas: Acrílico, Lona, Circular, Doble Vista');
            console.log('   • Neón: Normal y 2.0');
            console.log('   • Impresiones: Lona Normal, Vinil Reflectivo');
            console.log('   • Letras 3D: 5cm grosor, 10 unidades');
            console.log('   • Banner con Ojillos');
            console.log('   • Producto Personalizado: Sistema LED');
            
            // Forzar actualización final
            this.forzarActualizacionCompleta();
            
        } catch (error) {
            console.error('❌ Error durante la generación:', error);
        }
    },

    // Test simple
    async testSimple() {
        console.log('🧪 Test simple...');
        
        this.limpiarTodo();
        this.mostrarFormulario();
        
        await new Promise(resolve => setTimeout(resolve, 200));
        
        document.getElementById('clienteNombre').value = 'Test Simple';
        
        const exito = await this.agregarProductoConCategoriaReal('cajas', '1', {
            'base': 100,
            'altura': 200
        });
        
        if (exito) {
            console.log('🎉 ¡Test exitoso!');
        } else {
            console.log('❌ Test falló');
        }
    },

    // NUEVO - Investigar función editarCotizacion
    investigarEditarCotizacion() {
        console.log('🔍 Investigando función editarCotizacion...');
        
        try {
            // Verificar si la función existe (con manejo de errores)
            console.log('editarCotizacion existe:', typeof editarCotizacion !== 'undefined' ? typeof editarCotizacion : 'undefined');
            console.log('window.editarCotizacion existe:', typeof window.editarCotizacion !== 'undefined' ? typeof window.editarCotizacion : 'undefined');
            
            // Verificar app con manejo seguro
            let appEditarExiste = false;
            try {
                appEditarExiste = typeof app !== 'undefined' && typeof app.editarCotizacion === 'function';
            } catch (e) {
                appEditarExiste = false;
            }
            console.log('app.editarCotizacion existe:', appEditarExiste);
            
            // Buscar en el DOM elementos relacionados con edición
            const elementosEdicion = document.querySelectorAll('[onclick*="editarCotizacion"], [onclick*="editar"], .btn-editar, .edit-btn');
            console.log('Elementos de edición encontrados:', elementosEdicion.length);
            
            elementosEdicion.forEach((elemento, i) => {
                console.log(`${i+1}. ${elemento.tagName} - onclick: ${elemento.onclick || elemento.getAttribute('onclick')}`);
            });
            
            // Verificar si hay productos en la lista para editar
            const listaProductos = document.getElementById('listaProductos') || document.querySelector('.productos-list') || document.querySelector('#productos-lista');
            if (listaProductos) {
                console.log('Lista de productos encontrada, productos actuales:', listaProductos.children.length);
                
                // Mostrar algunos productos si existen
                if (listaProductos.children.length > 0) {
                    console.log('Primeros 3 productos:');
                    for (let i = 0; i < Math.min(3, listaProductos.children.length); i++) {
                        const producto = listaProductos.children[i];
                        console.log(`  ${i+1}. ${producto.textContent?.substring(0, 50)}...`);
                    }
                }
            } else {
                console.log('❌ No se encontró lista de productos');
            }
            
            // Buscar botones de editar en productos existentes
            const botonesEditar = document.querySelectorAll('button[onclick*="editar"], .editar-producto');
            console.log('Botones de editar productos:', botonesEditar.length);
            
            // Buscar todos los botones que contengan "editar" en el texto
            const todosBotones = document.querySelectorAll('button');
            const botonesConEditar = Array.from(todosBotones).filter(btn => 
                btn.textContent.toLowerCase().includes('editar') || 
                btn.innerHTML.toLowerCase().includes('editar')
            );
            console.log('Botones con texto "editar":', botonesConEditar.length);
            botonesConEditar.forEach((btn, i) => {
                console.log(`  ${i+1}. "${btn.textContent.trim()}" - onclick: ${btn.getAttribute('onclick')}`);
            });
            
            // Buscar en todo el DOM funciones que contengan "editar"
            console.log('\n🔍 Buscando en todo el documento...');
            const todosElementos = document.querySelectorAll('*[onclick]');
            const elementosConEditar = Array.from(todosElementos).filter(el => 
                el.getAttribute('onclick')?.includes('editar')
            );
            console.log('Elementos con onclick que contiene "editar":', elementosConEditar.length);
            elementosConEditar.forEach((el, i) => {
                console.log(`  ${i+1}. ${el.tagName} - onclick: ${el.getAttribute('onclick')}`);
            });
            
            return {
                funcionExiste: typeof editarCotizacion !== 'undefined' && typeof editarCotizacion === 'function',
                elementosEdicion: elementosEdicion.length,
                botonesEditar: botonesEditar.length,
                botonesConTextoEditar: botonesConEditar.length
            };
            
        } catch (error) {
            console.error('❌ Error durante la investigación:', error);
            return { error: error.message };
        }
    },

    // NUEVO - Automatizar edición de productos existentes
    async editarProductoExistente(indice, nuevaConfig) {
        console.log(`🔧 Editando producto ${indice} con nueva configuración...`);
        
        try {
            // Buscar botón de editar del producto específico
            const botonesEditar = document.querySelectorAll('button[onclick*="editar"]');
            
            if (indice < botonesEditar.length) {
                const botonEditar = botonesEditar[indice];
                console.log(`Haciendo clic en botón editar ${indice}...`);
                botonEditar.click();
                
                await new Promise(resolve => setTimeout(resolve, 300));
                
                // Llenar nueva configuración
                Object.keys(nuevaConfig).forEach(campo => {
                    const elemento = document.getElementById(campo);
                    if (elemento) {
                        elemento.value = nuevaConfig[campo];
                        console.log(`✅ ${campo} = ${nuevaConfig[campo]}`);
                    }
                });
                
                // Buscar botón de guardar/actualizar
                const botonGuardar = document.querySelector('button[onclick*="actualizar"], button[onclick*="guardar"], .btn-guardar');
                if (botonGuardar) {
                    botonGuardar.click();
                    console.log('✅ Cambios guardados');
                }
                
                return true;
            } else {
                console.error(`❌ No se encontró producto en índice ${indice}`);
                return false;
            }
            
        } catch (error) {
            console.error('❌ Error editando producto:', error);
            return false;
        }
    },

    // NUEVO - Editar datos de cliente rápidamente
    editarClienteRapido(nombre = 'Cliente Editado', empresa = 'Empresa Nueva') {
        console.log('🔧 Edición rápida de cliente...');
        
        try {
            const camposCliente = {
                'clienteNombre': nombre,
                'clienteEmpresa': empresa,
                'clienteContacto': 'contacto@editado.com'
            };
            
            Object.keys(camposCliente).forEach(campo => {
                const elemento = document.getElementById(campo);
                if (elemento) {
                    elemento.value = camposCliente[campo];
                    elemento.dispatchEvent(new Event('change'));
                    console.log(`✅ ${campo} = ${camposCliente[campo]}`);
                }
            });
            
            return true;
            
        } catch (error) {
            console.error('❌ Error en edición rápida:', error);
            return false;
        }
    },

    // NUEVO - Simular edición completa
    async simularEdicionCompleta() {
        console.log('🔧 Simulando edición completa...');
        
        // 1. Primero agregar algunos productos
        await this.agregarProductoConCategoriaReal('cajas', '1', {base: 100, altura: 200});
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await this.agregarProductoConCategoriaReal('neon', '3', {base: 80, altura: 80, tipoNeon: '1'});
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 2. Intentar editar el primer producto
        console.log('Intentando editar primer producto...');
        const resultado = await this.editarProductoExistente(0, {
            base: 150,  // Cambiar base
            altura: 250 // Cambiar altura
        });
        
        if (resultado) {
            console.log('✅ Edición simulada completada');
        } else {
            console.log('⚠️ No se pudo editar - revisar estructura');
        }
    },

    // NUEVO - Buscar todos los elementos de edición
    buscarElementosEdicion() {
        console.log('🔍 Buscando todos los elementos de edición...');
        
        // Buscar diferentes tipos de elementos relacionados con edición
        const selectores = [
            'button[onclick*="editar"]',
            '[onclick*="editarCotizacion"]',
            '.btn-editar',
            '.edit-btn',
            'button:contains("Editar")',
            '[data-action="edit"]',
            '.producto-editar'
        ];
        
        selectores.forEach(selector => {
            try {
                const elementos = document.querySelectorAll(selector);
                if (elementos.length > 0) {
                    console.log(`✅ Encontrados con "${selector}":`, elementos.length);
                    elementos.forEach((el, i) => {
                        console.log(`  ${i+1}. ${el.tagName} - "${el.textContent?.trim()}" - onclick: ${el.getAttribute('onclick')}`);
                    });
                }
            } catch (error) {
                // Ignorar errores de selectores CSS que no funcionen
            }
        });
    },

    // Ayuda
    mostrarAyuda() {
        console.log(`
🔧 DevScripts - Comandos disponibles:

📋 Funciones básicas:
• DevScripts.testSimple()                    - Test básico
• DevScripts.limpiarTodo()                   - Limpiar formulario

🎯 Crear cotizaciones:
• DevScripts.recrearCotizacionIO2025()       - Cotización IO completa

✏️ Editar cotizaciones:
• DevScripts.editarSoloCliente()             - Solo editar cliente
• DevScripts.editarCotizacionPersonalizada() - Edición personalizada
• DevScripts.soloEliminarProducto(0)         - Eliminar UN producto
• DevScripts.guardarDatosCliente()           - Guardar datos manualmente

🚀 Flujos completos:
• DevScripts.crearIO4Directo()               - Crear IO4 completo
• DevScripts.crearIO5Directo()               - Crear IO5 completo
• DevScripts.crearIO6Minimalista()           - Crear IO6 completo

🛠️ Debugging:
• DevScripts.investigarFormularioEdicion()   - Ver formulario de edición
        `);
    },

    // NUEVO - Editar cotización IO después de crearla
    async editarCotizacionIO2025() {
        console.log('✏️ Editando cotización IO 2025 - Modificaciones específicas...');
        
        try {
            // Primero verificar que hay productos en la lista
            const listaProductos = document.getElementById('listaProductos');
            if (!listaProductos || listaProductos.children.length === 0) {
                console.error('❌ No hay productos para editar. Ejecuta primero DevScripts.recrearCotizacionIO2025()');
                return false;
            }
            
            console.log(`📋 Productos encontrados: ${listaProductos.children.length}`);
            
            // Buscar todos los botones de editar
            const botonesEditar = document.querySelectorAll('button[onclick*="editarProducto"], .btn-editar-producto');
            console.log(`🔧 Botones de editar encontrados: ${botonesEditar.length}`);
            
            if (botonesEditar.length === 0) {
                console.error('❌ No se encontraron botones de editar');
                return false;
            }
            
            // MODIFICACIONES ESPECÍFICAS DE LA COTIZACIÓN IO:
            
            // 1. Editar primera caja de acrílico (cambiar dimensiones)
            console.log('1. Editando Caja de Acrílico...');
            await this.editarProductoPorIndice(0, {
                'base': 140,     // Cambiar de 120 a 140
                'altura': 260    // Cambiar de 240 a 260
            });
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // 2. Editar segundo producto - Caja de Lona
            console.log('2. Editando Caja de Lona...');
            await this.editarProductoPorIndice(1, {
                'base': 250,     // Cambiar de 240 a 250
                'altura': 130    // Cambiar de 120 a 130
            });
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // 3. Editar Neón Normal (cambiar a dimensiones más grandes)
            console.log('3. Editando Neón Normal...');
            await this.editarProductoPorIndice(2, {
                'base': 100,     // Cambiar de 90 a 100
                'altura': 100,   // Cambiar de 90 a 100
                'tipoNeon': '1'  // Mantener tipo normal
            });
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // 4. Editar Letras 3D (cambiar material y altura)
            console.log('4. Editando Letras 3D...');
            await this.editarProductoPorIndice(6, {
                'altura3D': 350,      // Cambiar de 300 a 350
                'material3D': '2',    // Cambiar a aluminio con luz
                'base3D': 140,        // Cambiar base
                'alturaInfo3D': 280   // Cambiar altura info
            });
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // 5. Editar producto personalizado (cambiar precio)
            console.log('5. Editando Producto Personalizado...');
            await this.editarProductoPorIndice(10, {
                'descripcionOtro': 'Caja Cubica Premium 60x60',  // Nueva descripción
                'costoOtro': 950  // Cambiar de 800 a 950
            });
            await new Promise(resolve => setTimeout(resolve, 500));
            
            console.log('✅ Edición de cotización IO completada');
            console.log('📊 Productos modificados:');
            console.log('   • Caja Acrílico: 140x260 cm');
            console.log('   • Caja Lona: 250x130 cm'); 
            console.log('   • Neón Normal: 100x100 cm');
            console.log('   • Letras 3D: 350cm, Aluminio con luz');
            console.log('   • Producto Personalizado: $950');
            
            return true;
            
        } catch (error) {
            console.error('❌ Error editando cotización:', error);
            return false;
        }
    },

    // FUNCIÓN HELPER - Editar producto por índice
    async editarProductoPorIndice(indice, nuevosValores) {
        console.log(`🔧 Editando producto ${indice}...`);
        
        try {
            // Buscar el botón de editar correspondiente al índice
            const botonesEditar = document.querySelectorAll('button[onclick*="editarProducto"]');
            
            if (indice >= botonesEditar.length) {
                console.error(`❌ Producto ${indice} no existe`);
                return false;
            }
            
            // Hacer clic en el botón de editar
            const botonEditar = botonesEditar[indice];
            console.log(`Haciendo clic en editar para producto ${indice}...`);
            botonEditar.click();
            
            // Esperar que aparezca el formulario de edición
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Llenar los nuevos valores
            Object.keys(nuevosValores).forEach(campo => {
                const elemento = document.getElementById(campo);
                if (elemento) {
                    elemento.value = nuevosValores[campo];
                    // Disparar evento change para que se actualice
                    elemento.dispatchEvent(new Event('change'));
                    console.log(`  ✅ ${campo} = ${nuevosValores[campo]}`);
                } else {
                    console.warn(`  ⚠️ Campo ${campo} no encontrado`);
                }
            });
            
            // Buscar y hacer clic en el botón de guardar/actualizar
            const botonesGuardar = document.querySelectorAll('button[onclick*="actualizarProducto"], button[onclick*="guardarEdicion"], .btn-guardar');
            if (botonesGuardar.length > 0) {
                botonesGuardar[0].click();
                console.log(`  ✅ Producto ${indice} actualizado`);
            } else {
                console.warn(`  ⚠️ No se encontró botón de guardar`);
            }
            
            return true;
            
        } catch (error) {
            console.error(`❌ Error editando producto ${indice}:`, error);
            return false;
        }
    },

    // NUEVA FUNCIÓN - Editar por nombre de producto
    async editarProductoPorNombre(nombreProducto, nuevosValores) {
        console.log(`🔧 Editando producto "${nombreProducto}"...`);
        
        try {
            const listaProductos = document.getElementById('listaProductos');
            const productos = Array.from(listaProductos.children);
            
            // Buscar producto por nombre
            const indiceProducto = productos.findIndex(producto => 
                producto.textContent.toLowerCase().includes(nombreProducto.toLowerCase())
            );
            
            if (indiceProducto === -1) {
                console.error(`❌ Producto "${nombreProducto}" no encontrado`);
                return false;
            }
            
            console.log(`✅ Producto "${nombreProducto}" encontrado en índice ${indiceProducto}`);
            return await this.editarProductoPorIndice(indiceProducto, nuevosValores);
            
        } catch (error) {
            console.error(`❌ Error editando producto "${nombreProducto}":`, error);
            return false;
        }
    },

    // FUNCIÓN RÁPIDA - Solo cambiar dimensiones de cajas principales
    async editarDimensionesPrincipales() {
        console.log('🔧 Edición rápida - Solo dimensiones principales...');
        
        // Editar solo las cajas principales con nuevas dimensiones
        await this.editarProductoPorIndice(0, { base: 150, altura: 300 }); // Caja acrílico
        await new Promise(resolve => setTimeout(resolve, 400));
        
        await this.editarProductoPorIndice(1, { base: 300, altura: 150 }); // Caja lona
        await new Promise(resolve => setTimeout(resolve, 400));
        
        console.log('✅ Dimensiones principales actualizadas');
    },

    // Flujo completo que funciona
    async flujoCompletoReal() {
        // 1. Crear cotización
        await DevScripts.recrearCotizacionIO2025();
        
        // 2. Esperar
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 3. Editar (método real)
        await DevScripts.editarCotizacionIO2025Real();
    },

    // Función que hace todo automáticamente
    flujoCompletoIO2025: async function() {
        console.log('🚀 Flujo completo: Crear + Editar cotización IO...');
        
        // 1. Crear cotización
        await this.recrearCotizacionIO2025();
        
        // 2. Esperar 2 segundos
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 3. Editar cotización
        await this.editarCotizacionIO2025();
        
        console.log('✅ Flujo completo terminado');
    },

    // CORREGIDO - Sistema de edición real (SOLO DEFINIR, NO EJECUTAR)
    async editarCotizacionIO2025Real() {
        console.log('✏️ Editando cotización IO 2025 (método real)...');
        
        try {
            // 1. EDITAR DATOS DEL CLIENTE
            console.log('1. Editando datos del cliente...');
            
            if (typeof editarCotizacion === 'function') {
                editarCotizacion();
                console.log('✅ Función editarCotizacion() ejecutada');
                
                await new Promise(resolve => setTimeout(resolve, 300));
                
                const nuevosValores = {
                    'clienteNombre': 'IO - EDITADO',
                    'clienteEmpresa': 'IO EMPRESA MODIFICADA',
                    'clienteContacto': 'contacto-editado@io.com'
                };
                
                Object.keys(nuevosValores).forEach(campo => {
                    const elemento = document.getElementById(campo);
                    if (elemento) {
                        elemento.value = nuevosValores[campo];
                        elemento.dispatchEvent(new Event('change'));
                        console.log(`✅ ${campo} = ${nuevosValores[campo]}`);
                    }
                });
                
                console.log('✅ Datos del cliente actualizados');
            }
            
            // 2. MODIFICAR PRODUCTOS
            console.log('\n2. Modificando productos específicos...');
            
            console.log('2.1 Modificando Caja de Acrílico...');
            await this.reemplazarProducto(0, 'cajas', '1', {
                'base': 140,     
                'altura': 260    
            });
            
            console.log('2.2 Modificando Caja de Lona...');
            await this.reemplazarProducto(0, 'cajas', '2', {
                'base': 250,     
                'altura': 130    
            });
            
            console.log('2.3 Modificando Neón Normal...');
            await this.reemplazarProducto(0, 'neon', '3', {
                'base': 100,     
                'altura': 100,   
                'tipoNeon': '1'
            });
            
            console.log('✅ Edición de cotización IO completada');
            return true;
            
        } catch (error) {
            console.error('❌ Error editando cotización:', error);
            return false;
        }
    },

    // NUEVA FUNCIÓN - Reemplazar producto (eliminar + agregar)
    async reemplazarProducto(indice, categoria, tipo, config) {
        console.log(`🔄 Reemplazando producto en índice ${indice}...`);
        
        try {
            // 1. Eliminar producto actual
            const botonesEliminar = document.querySelectorAll('button[onclick*="eliminarProducto"]');
            
            if (indice < botonesEliminar.length) {
                const botonEliminar = botonesEliminar[indice];
                console.log(`🗑️ Eliminando producto en índice ${indice}...`);
                botonEliminar.click();
                
                // Esperar que se elimine
                await new Promise(resolve => setTimeout(resolve, 300));
            }
            
            // 2. Agregar nuevo producto con valores modificados
            console.log(`➕ Agregando producto modificado...`);
            const exito = await this.agregarProductoConCategoriaReal(categoria, tipo, config);
            
            if (exito) {
                console.log(`✅ Producto reemplazado exitosamente`);
                return true;
            } else {
                console.error(`❌ Error agregando producto de reemplazo`);
                return false;
            }
            
        } catch (error) {
            console.error(`❌ Error reemplazando producto:`, error);
            return false;
        }
    },

    // CORREGIDO - Edición personalizada con mejor manejo de errores
    async editarCotizacionPersonalizada(config = {}) {
        console.log('✏️ Edición personalizada de cotización...');
        
        const defaultConfig = {
            nuevoNombre: 'IO2',
            empresa: 'IO2 EMPRESA',
            eliminarIndices: [],
            modificarProductos: [],
            nuevosProductos: []
        };
        
        const finalConfig = { ...defaultConfig, ...config };
        
        try {
            // 1. Cambiar nombre
            if (finalConfig.nuevoNombre) {
                console.log(`1. Cambiando nombre a "${finalConfig.nuevoNombre}"...`);
                
                if (typeof editarCotizacion === 'function') {
                    editarCotizacion();
                    await new Promise(resolve => setTimeout(resolve, 300));
                    
                    const elemento = document.getElementById('clienteNombre');
                    if (elemento) {
                        elemento.value = finalConfig.nuevoNombre;
                        elemento.dispatchEvent(new Event('change'));
                        elemento.dispatchEvent(new Event('input'));
                        console.log(`✅ Nombre cambiado a: ${finalConfig.nuevoNombre}`);
                    }
                    
                    if (finalConfig.empresa) {
                        const elementoEmpresa = document.getElementById('clienteEmpresa');
                        if (elementoEmpresa) {
                            elementoEmpresa.value = finalConfig.empresa;
                            elementoEmpresa.dispatchEvent(new Event('change'));
                            elementoEmpresa.dispatchEvent(new Event('input'));
                            console.log(`✅ Empresa cambiada a: ${finalConfig.empresa}`);
                        }
                    }
                    
                    // Guardar datos del cliente
                    const guardadoExitoso = await this.guardarDatosCliente();
                    if (guardadoExitoso) {
                        console.log('✅ Datos del cliente guardados exitosamente');
                    } else {
                        console.warn('⚠️ Los datos del cliente pueden no haberse guardado correctamente');
                    }
                    
                    // Esperar un poco más después de guardar
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }
            
            // 2. Eliminar productos (de mayor a menor índice)
            if (finalConfig.eliminarIndices && finalConfig.eliminarIndices.length > 0) {
                console.log('2. Eliminando productos...');
                
                const indicesOrdenados = [...finalConfig.eliminarIndices].sort((a, b) => b - a);
                console.log(`Eliminando en orden: [${indicesOrdenados.join(', ')}]`);
                
                for (const indice of indicesOrdenados) {
                    console.log(`🗑️ Eliminando producto en índice ${indice}...`);
                    
                    // Verificar que el producto existe antes de eliminarlo
                    const botonesEliminar = document.querySelectorAll('button[onclick*="eliminarProducto"]');
                    if (indice < botonesEliminar.length) {
                        const exito = await this.eliminarProductoPorIndice(indice);
                        
                        if (exito) {
                            console.log(`✅ Producto ${indice} eliminado correctamente`);
                        } else {
                            console.error(`❌ Error eliminando producto ${indice}`);
                        }
                    } else {
                        console.warn(`⚠️ Producto ${indice} no existe (máximo: ${botonesEliminar.length - 1})`);
                    }
                    
                    await new Promise(resolve => setTimeout(resolve, 400));
                }
                
                console.log('✅ Eliminación de productos completada');
                await new Promise(resolve => setTimeout(resolve, 500)); // Esperar más después de eliminar todo
            }
            
            // 3. Modificar productos
            if (finalConfig.modificarProductos && finalConfig.modificarProductos.length > 0) {
                console.log('3. Modificando productos...');
                for (const mod of finalConfig.modificarProductos) {
                    console.log(`🔧 Modificando producto ${mod.indice}...`);
                    try {
                        await this.reemplazarProducto(mod.indice, mod.categoria, mod.tipo, mod.config);
                        await new Promise(resolve => setTimeout(resolve, 500));
                    } catch (error) {
                        console.error(`❌ Error modificando producto ${mod.indice}:`, error);
                    }
                }
            }
            
            // 4. Agregar nuevos productos
            if (finalConfig.nuevosProductos && finalConfig.nuevosProductos.length > 0) {
                console.log('\n4. Agregando nuevos productos...');
                console.log(`Total de productos a agregar: ${finalConfig.nuevosProductos.length}`);
                
                for (let i = 0; i < finalConfig.nuevosProductos.length; i++) {
                    const nuevo = finalConfig.nuevosProductos[i];
                    console.log(`\n4.${i+1} Agregando producto: ${nuevo.categoria} tipo ${nuevo.tipo}`);
                    console.log(`Configuración:`, nuevo.config);
                    
                    try {
                        const exito = await this.agregarProductoConCategoriaReal(nuevo.categoria, nuevo.tipo, nuevo.config);
                        
                        if (exito) {
                            console.log(`✅ Producto ${i+1} agregado exitosamente`);
                        } else {
                            console.error(`❌ Error agregando producto ${i+1}`);
                        }
                        
                        // Esperar más tiempo entre agregados
                        await new Promise(resolve => setTimeout(resolve, 800));
                        
                    } catch (error) {
                        console.error(`❌ Error agregando producto ${i+1}:`, error);
                        // Continuar con el siguiente producto
                    }
                }
                
                console.log('✅ Proceso de agregado de productos completado');
            }
            
            console.log('\n✅ Edición personalizada completada');
            
            // Verificar el resultado final
            const productosFinales = document.querySelectorAll('button[onclick*="eliminarProducto"]');
            console.log(`📊 Productos finales: ${productosFinales.length}`);
            
            return true;
            
        } catch (error) {
            console.error('❌ Error en edición personalizada:', error);
            console.error('Stack trace:', error.stack);
            return false;
        }
    },

    // CORREGIDA - Edición personalizada con manejo robusto de índices
    async editarCotizacionPersonalizadaRobusta(config = {}) {
        console.log('✏️ Edición personalizada robusta (DOM mejorado)...');
        
        const defaultConfig = {
            nuevoNombre: 'IO2',
            empresa: 'IO2 EMPRESA',
            eliminarIndices: [],
            modificarProductos: [],
            nuevosProductos: []
        };
        
        const finalConfig = { ...defaultConfig, ...config };
        
        try {
            // 1. CAMBIAR NOMBRE DEL CLIENTE
            if (finalConfig.nuevoNombre) {
                console.log(`1. Cambiando nombre a "${finalConfig.nuevoNombre}"...`);
                const exitoNombre = await this.cambiarSoloNombreCliente(finalConfig.nuevoNombre);
                
                if (exitoNombre) {
                    console.log('✅ Nombre cambiado exitosamente');
                    await new Promise(resolve => setTimeout(resolve, 800));
                }
            }

            // 2. ELIMINAR PRODUCTOS (DE MAYOR A MENOR)
            if (finalConfig.eliminarIndices && finalConfig.eliminarIndices.length > 0) {
                console.log('2. Eliminando productos...');
                
                const indicesOrdenados = [...finalConfig.eliminarIndices].sort((a, b) => b - a);
                console.log(`Eliminando en orden: [${indicesOrdenados.join(', ')}]`);
                
                for (const indice of indicesOrdenados) {
                    console.log(`🗑️ Eliminando producto ${indice}...`);
                    
                    const botonesActuales = document.querySelectorAll('button[onclick*="eliminarProducto"]');
                    const botonesUnicos = this.filtrarBotonesDuplicados(botonesActuales);
                    
                    if (indice < botonesUnicos.length) {
                        botonesUnicos[indice].click();
                        await new Promise(resolve => setTimeout(resolve, 400));
                        
                        // Forzar actualización después de eliminar
                        await this.forzarActualizacionDOM();
                        await new Promise(resolve => setTimeout(resolve, 200));
                        
                        console.log(`✅ Producto ${indice} eliminado`);
                    } else {
                        console.warn(`⚠️ Índice ${indice} no válido`);
                    }
                }
                
                console.log('✅ Eliminación completada');
            }

            // 3. AGREGAR NUEVOS PRODUCTOS
            if (finalConfig.nuevosProductos && finalConfig.nuevosProductos.length > 0) {
                console.log('3. Agregando nuevos productos...');
                
                for (let i = 0; i < finalConfig.nuevosProductos.length; i++) {
                    const nuevo = finalConfig.nuevosProductos[i];
                    console.log(`\n3.${i+1} Agregando: ${nuevo.categoria} tipo ${nuevo.tipo}...`);
                    
                    try {
                        // Resetear formulario
                        this.resetearFormularioProductos();
                        await new Promise(resolve => setTimeout(resolve, 400));
                        
                        // Agregar producto
                        const exito = await this.agregarProductoConCategoriaReal(nuevo.categoria, nuevo.tipo, nuevo.config);
                        
                        if (exito) {
                            console.log(`✅ Producto ${i+1} agregado`);
                            
                            // FORZAR ACTUALIZACIÓN DESPUÉS DE CADA PRODUCTO
                            await this.forzarActualizacionDOM();
                            await new Promise(resolve => setTimeout(resolve, 500));
                            
                        } else {
                            console.error(`❌ Error agregando producto ${i+1}`);
                        }
                        
                    } catch (error) {
                        console.error(`❌ Error con producto ${i+1}:`, error);
                    }
                }
            }

            // 4. ACTUALIZACIÓN FINAL MÚLTIPLE
            console.log('4. Actualización final múltiple...');
            
            // Ejecutar 3 actualizaciones con delay
            for (let i = 0; i < 3; i++) {
                await this.forzarActualizacionDOM();
                await new Promise(resolve => setTimeout(resolve, 300));
            }

            // 5. VERIFICACIÓN FINAL
            const productosFinales = this.contarProductosReales();
            console.log(`\n✅ Edición robusta completada`);
            console.log(`📊 PRODUCTOS FINALES: ${productosFinales}`);
            
            return true;
            
        } catch (error) {
            console.error('❌ Error en edición robusta:', error);
            return false;
        }
    },

    // HELPER - Filtrar botones duplicados para contar correctamente
    filtrarBotonesDuplicados(botones) {
        const botonesUnicos = [];
        const indicesVistos = new Set();
        
        botones.forEach(btn => {
            const onclick = btn.getAttribute('onclick');
            const match = onclick.match(/eliminarProducto\((\d+)\)/);
            if (match) {
                const indice = parseInt(match[1]);
                if (!indicesVistos.has(indice)) {
                    indicesVistos.add(indice);
                    botonesUnicos.push(btn);
                }
            }
        });
        
        return botonesUnicos;
    },

    // NUEVA FUNCIÓN - Forzar actualización completa del DOM
    async forzarActualizacionDOM() {
        console.log('🔄 Forzando actualización completa del DOM...');
        
        try {
            // 1. Actualizar ProductManager si existe
            if (window.app?.productManager) {
                console.log('📦 Actualizando ProductManager...');
                
                if (typeof window.app.productManager.actualizarListaHTML === 'function') {
                    window.app.productManager.actualizarListaHTML();
                    console.log('✅ actualizarListaHTML ejecutada');
                }
                
                if (typeof window.app.productManager.renderizarLista === 'function') {
                    window.app.productManager.renderizarLista();
                    console.log('✅ renderizarLista ejecutada');
                }
                
                if (typeof window.app.productManager.actualizarTotal === 'function') {
                    window.app.productManager.actualizarTotal();
                    console.log('✅ actualizarTotal ejecutada');
                }
            }
            
            // 2. Actualizar ExportManager si existe
            if (window.app?.exportManager) {
                console.log('📄 Actualizando ExportManager...');
                
                if (typeof window.app.exportManager.actualizarCotizacion === 'function') {
                    window.app.exportManager.actualizarCotizacion();
                    console.log('✅ actualizarCotizacion ejecutada');
                }
            }
            
            // 3. Llamar funciones globales de actualización
            const funcionesGlobales = [
                'calcularTotal',
                'actualizarVista', 
                'actualizarCotizacion',
                'renderizarLista',
                'actualizarHTML',
                'refrescarLista',
                'actualizarProductos'
            ];
            
            funcionesGlobales.forEach(nombreFuncion => {
                if (typeof window[nombreFuncion] === 'function') {
                    try {
                        window[nombreFuncion]();
                        console.log(`✅ ${nombreFuncion}() ejecutada`);
                    } catch (error) {
                        console.warn(`⚠️ Error en ${nombreFuncion}:`, error);
                    }
                }
            });
            
            // 4. Forzar re-render específico del contenedor de productos
            const contenedores = [
                'listaProductos',
                'productosContainer',
                'productos-lista',
                'cotizacion-productos'
            ];
            
            contenedores.forEach(id => {
                const elemento = document.getElementById(id);
                if (elemento) {
                    console.log(`🔄 Forzando re-render de ${id}...`);
                    
                    // Trigger reflow forzado
                    elemento.style.display = 'none';
                    elemento.offsetHeight; // Force reflow
                    elemento.style.display = '';
                    
                    // Dispatch events
                    elemento.dispatchEvent(new Event('change'));
                    elemento.dispatchEvent(new Event('update'));
                    
                    console.log(`✅ ${id} actualizado`);
                }
            });
            
            // 5. Disparar eventos personalizados
            const eventos = [
                'productoAgregado',
                'listaActualizada', 
                'cotizacionCambiada',
                'productosModificados',
                'actualizacionCompleta'
            ];
            
            eventos.forEach(evento => {
                document.dispatchEvent(new CustomEvent(evento, { 
                    detail: { timestamp: Date.now() }
                }));
            });
            
            // 6. Actualización final con timeout (NO await)
            setTimeout(() => {
                // Re-ejecutar renderización si existe función específica
                if (window.app?.render) {
                    window.app.render();
                }
                
                // Forzar actualización adicional de la lista
                if (window.app?.productManager?.actualizarListaHTML) {
                    window.app.productManager.actualizarListaHTML();
                    console.log('🔄 Segunda actualización de lista ejecutada');
                }
            }, 300);
            
            console.log('✅ Actualización completa ejecutada');
            
        } catch (error) {
            console.error('❌ Error forzando actualización completa:', error);
        }
    },

    // FUNCIÓN DE DEBUG ESPECÍFICA
    async debugEstadoCompleto() {
        console.log('🔍 Debug estado completo...');
        
        console.log('\n1. Productos actuales:');
        const productos = document.querySelectorAll('button[onclick*="eliminarProducto"]');
        productos.forEach((btn, i) => {
            console.log(`  ${i}. ${btn.getAttribute('onclick')}`);
        });
        
        console.log('\n2. Estado del formulario:');
        const categoriaSelect = document.getElementById('categoriaProducto');
        const tipoSelect = document.getElementById('tipoProducto');
        console.log(`   Categoría disponible: ${categoriaSelect ? 'SÍ' : 'NO'}`);
        console.log(`   Tipo disponible: ${tipoSelect ? 'SÍ' : 'NO'}`);
        
        console.log('\n3. Test de agregado simple:');
        try {
            const exito = await this.agregarProductoConCategoriaReal('cajas', '1', {base: 100, altura: 200});
            console.log(`   Resultado: ${exito ? 'ÉXITO' : 'FALLO'}`);
        } catch (error) {
            console.error('   Error:', error.message);
        }
    },

    // NUEVA FUNCIÓN HELPER - Guardar datos del cliente
    async guardarDatosCliente() {
        console.log('💾 Guardando datos del cliente...');
        
        try {
            // Buscar específicamente el botón "Guardar Cambios" que viste en el debug
            const botonGuardarCambios = Array.from(document.querySelectorAll('button')).find(btn => 
                btn.textContent.trim() === 'Guardar Cambios'
            );
            
            if (botonGuardarCambios) {
                console.log('✅ Encontrado botón "Guardar Cambios"');
                botonGuardarCambios.click();
                await new Promise(resolve => setTimeout(resolve, 500));
                console.log('✅ Datos guardados con "Guardar Cambios"');
                return true;
            }
            
            // Buscar botón con onclick="guardarEdicion()"
            const botonGuardarEdicion = document.querySelector('button[onclick="guardarEdicion()"]');
            if (botonGuardarEdicion) {
                console.log('✅ Encontrado botón con guardarEdicion()');
                botonGuardarEdicion.click();
                await new Promise(resolve => setTimeout(resolve, 500));
                console.log('✅ Datos guardados con guardarEdicion()');
                return true;
            }
            
            // Fallback - buscar otros botones de guardar
            const selectoresGuardar = [
                'button[onclick*="guardar"]',
                'button[onclick*="actualizar"]',
                'button[onclick*="save"]',
                '.btn-guardar',
                '.btn-save',
                '.btn-actualizar'
            ];
            
            for (const selector of selectoresGuardar) {
                const botones = document.querySelectorAll(selector);
                if (botones.length > 0) {
                    console.log(`✅ Botón encontrado con selector: ${selector}`);
                    botones[0].click();
                    await new Promise(resolve => setTimeout(resolve, 500));
                    console.log('✅ Datos guardados');
                    return true;
                }
            }
            
            // Si no encuentra botón, intentar llamar la función directamente
            if (typeof guardarEdicion === 'function') {
                console.log('🔄 Llamando guardarEdicion() directamente...');
                guardarEdicion();
                await new Promise(resolve => setTimeout(resolve, 500));
                console.log('✅ guardarEdicion() ejecutada');
                return true;
            }
            
            console.warn('⚠️ No se encontró forma de guardar los datos');
            return false;
            
        } catch (error) {
            console.error('❌ Error guardando datos:', error);
            return false;
        }
    },

    // NUEVA FUNCIÓN - Eliminar producto por índice (la que faltaba)
    async eliminarProductoPorIndice(indice) {
        console.log(`🗑️ Eliminando producto en índice ${indice}...`);
        
        try {
            const botonesEliminar = document.querySelectorAll('button[onclick*="eliminarProducto"]');
            
            if (indice < botonesEliminar.length) {
                const botonEliminar = botonesEliminar[indice];
                botonEliminar.click();
                console.log(`✅ Producto ${indice} eliminado`);
                return true;
            } else {
                console.error(`❌ No existe producto en índice ${indice}`);
                return false;
            }
            
        } catch (error) {
            console.error(`❌ Error eliminando producto ${indice}:`, error);
            return false;
        }
    },

    // NUEVA FUNCIÓN - Solo eliminar un producto (más segura)
    async soloEliminarProducto(indice) {
        console.log(`🎯 Eliminando SOLO producto ${indice}...`);
        
        try {
            const botonesEliminarAntes = document.querySelectorAll('button[onclick*="eliminarProducto"]');
            const productosAntes = botonesEliminarAntes.length;
            console.log(`Productos antes de eliminar: ${productosAntes}`);
            
            if (indice >= productosAntes) {
                console.error(`❌ Índice ${indice} fuera de rango (máximo: ${productosAntes - 1})`);
                return false;
            }
            
            const botonEliminar = botonesEliminarAntes[indice];
            botonEliminar.click();
            
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const botonesEliminarDespues = document.querySelectorAll('button[onclick*="eliminarProducto"]');
            const productosDespues = botonesEliminarDespues.length;
            console.log(`Productos después de eliminar: ${productosDespues}`);
            
            if (productosDespues === productosAntes - 1) {
                console.log(`✅ Producto ${indice} eliminado correctamente`);
                return true;
            } else {
                console.error(`❌ Error: se eliminaron ${productosAntes - productosDespues} productos en lugar de 1`);
                return false;
            }
            
        } catch (error) {
            console.error(`❌ Error eliminando producto ${indice}:`, error);
            return false;
        }
    },

    // FUNCIÓN DE DEBUG - Investigar formulario de edición
    investigarFormularioEdicion() {
        console.log('🔍 Investigando formulario de edición...');
        
        // Ejecutar editarCotizacion para abrir el formulario
        if (typeof editarCotizacion === 'function') {
            editarCotizacion();
            
            setTimeout(() => {
                console.log('📋 Elementos del formulario de edición:');
                
                // Buscar todos los campos del formulario
                const campos = document.querySelectorAll('input, select, textarea');
                console.log(`Total de campos encontrados: ${campos.length}`);
                
                campos.forEach((campo, i) => {
                    console.log(`  ${i+1}. ${campo.tagName} - ID: "${campo.id}" - Name: "${campo.name}" - Value: "${campo.value}"`);
                });
                
                // Buscar botones
                const botones = document.querySelectorAll('button');
                console.log(`\nTotal de botones encontrados: ${botones.length}`);
                
                botones.forEach((btn, i) => {
                    console.log(`  ${i+1}. "${btn.textContent.trim()}" - onclick: ${btn.getAttribute('onclick')}`);
                });
                
            }, 500);
        }
    },

    // NUEVA FUNCIÓN - Crear IO4 directamente
    async crearIO4Directo() {
        console.log('🚀 Creando cotización IO4 directamente...');
        
        try {
            // 1. Crear cotización original
            console.log('1. Creando cotización base...');
            await this.recrearCotizacionIO2025();
            
            // 2. Esperar que se complete
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // 3. Convertir a IO4
            console.log('2. Convirtiendo a IO4...');
            return await this.editarCotizacionPersonalizada({
                nuevoNombre: 'IO4',
                empresa: 'IO4 EMPRESA NUEVA',
                eliminarIndices: [0, 1, 2],
                nuevosProductos: [
                    { categoria: 'neon', tipo: '3', config: { base: 150, altura: 150, tipoNeon: '2' } },
                    { categoria: 'otros', tipo: '10', config: { descripcionOtro: 'Sistema LED Avanzado', costoOtro: 2500 } }
                ]
            });
            
        } catch (error) {
            console.error('❌ Error creando IO4:', error);
            return false;
        }
    },

    // NUEVA FUNCIÓN - Cambiar solo nombre del cliente (más directa)
    async cambiarSoloNombreCliente(nuevoNombre) {
        console.log(`👤 Cambiando nombre del cliente a "${nuevoNombre}"...`);
        
        try {
            // 1. Abrir edición
            if (typeof editarCotizacion === 'function') {
                editarCotizacion();
                await new Promise(resolve => setTimeout(resolve, 400));
                
                // 2. Cambiar nombre
                const elemento = document.getElementById('clienteNombre');
                if (elemento) {
                    elemento.value = nuevoNombre;
                    elemento.dispatchEvent(new Event('input'));
                    elemento.dispatchEvent(new Event('change'));
                    elemento.dispatchEvent(new Event('blur'));
                    console.log(`✅ Nombre cambiado a: ${nuevoNombre}`);
                    
                    // 3. Forzar guardado múltiple
                    await new Promise(resolve => setTimeout(resolve, 200));
                    
                    // Intentar múltiples formas de guardar
                    const exito1 = await this.guardarDatosCliente();
                    await new Promise(resolve => setTimeout(resolve, 300));
                    
                    // Verificar si el cambio se aplicó
                    const valorFinal = document.getElementById('clienteNombre')?.value;
                    console.log(`🔍 Valor final del campo: "${valorFinal}"`);
                    
                    if (valorFinal === nuevoNombre) {
                        console.log('✅ Nombre cambiado exitosamente');
                        return true;
                    } else {
                        console.warn('⚠️ El nombre no se guardó correctamente');
                        
                        // Intentar segundo guardado
                        console.log('🔄 Intentando segundo guardado...');
                        const exito2 = await this.guardarDatosCliente();
                        
                        await new Promise(resolve => setTimeout(resolve, 300));
                        const valorFinal2 = document.getElementById('clienteNombre')?.value;
                        
                        if (valorFinal2 === nuevoNombre) {
                            console.log('✅ Nombre guardado en segundo intento');
                            return true;
                        } else {
                            console.error('❌ No se pudo guardar el nombre');
                            return false;
                        }
                    }
                    
                } else {
                    console.error('❌ Campo clienteNombre no encontrado');
                    return false;
                }
            } else {
                console.error('❌ Función editarCotizacion no existe');
                return false;
            }
            
        } catch (error) {
            console.error('❌ Error cambiando nombre:', error);
            return false;
        }
    },

    // FUNCIÓN DE TEST - Verificar que el nombre se cambió
    verificarCambioNombre(nombreEsperado) {
        console.log(`🔍 Verificando cambio de nombre...`);
        
        // Verificar en múltiples lugares donde puede estar el nombre
        const lugares = [
            { id: 'clienteNombre', descripcion: 'Campo de edición' },
            { id: 'editarCliente', descripcion: 'Campo alternativo' },
            { selector: '.cliente-nombre', descripcion: 'Elemento con clase' },
            { selector: '.cotizacion-cliente', descripcion: 'Área de cotización' }
        ];
        
        let encontrado = false;
        
        lugares.forEach(lugar => {
            let elemento = null;
            
            if (lugar.id) {
                elemento = document.getElementById(lugar.id);
            } else if (lugar.selector) {
                elemento = document.querySelector(lugar.selector);
            }
            
            if (elemento) {
                const valor = elemento.value || elemento.textContent || elemento.innerText;
                console.log(`📋 ${lugar.descripcion}: "${valor}"`);
                
                if (valor && valor.includes(nombreEsperado)) {
                    console.log(`✅ Nombre encontrado en: ${lugar.descripcion}`);
                    encontrado = true;
                }
            }
        });
        
        if (encontrado) {
            console.log('✅ El nombre se cambió correctamente');
        } else {
            console.error('❌ El nombre no se encuentra en ningún lugar');
        }
        
        return encontrado;
    },

    // NUEVA FUNCIÓN - Edición personalizada usando método directo de nombres
    async editarCotizacionPersonalizadaDirecta(config = {}) {
        console.log('✏️ Edición personalizada (método directo)...');
        
        const defaultConfig = {
            nuevoNombre: 'IO2',
            empresa: 'IO2 EMPRESA',
            eliminarIndices: [],
            nuevosProductos: []
        };
        
        const finalConfig = { ...defaultConfig, ...config };
        
        try {
            // 1. CAMBIAR NOMBRE USANDO MÉTODO DIRECTO
            if (finalConfig.nuevoNombre) {
                console.log(`1. Cambiando nombre a "${finalConfig.nuevoNombre}" (método directo)...`);
                const exitoNombre = await this.cambiarSoloNombreCliente(finalConfig.nuevoNombre);
                
                if (exitoNombre) {
                    console.log('✅ Nombre cambiado exitosamente');
                    await new Promise(resolve => setTimeout(resolve, 800));
                    this.verificarCambioNombre(finalConfig.nuevoNombre);
                } else {
                    console.error('❌ No se pudo cambiar el nombre');
                }
            }
            
            // 2. ELIMINAR PRODUCTOS
            if (finalConfig.eliminarIndices && finalConfig.eliminarIndices.length > 0) {
                console.log('2. Eliminando productos...');
                
                const indicesOrdenados = [...finalConfig.eliminarIndices].sort((a, b) => b - a);
                console.log(`Eliminando en orden: [${indicesOrdenados.join(', ')}]`);
                
                for (const indice of indicesOrdenados) {
                    console.log(`🗑️ Eliminando producto ${indice}...`);
                    await this.soloEliminarProducto(indice);
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
                
                console.log('✅ Eliminación completada');
            }
            
            // 3. AGREGAR NUEVOS PRODUCTOS
            if (finalConfig.nuevosProductos && finalConfig.nuevosProductos.length > 0) {
                console.log('3. Agregando nuevos productos...');
                
                for (let i = 0; i < finalConfig.nuevosProductos.length; i++) {
                    const nuevo = finalConfig.nuevosProductos[i];
                    console.log(`Agregando ${nuevo.categoria} tipo ${nuevo.tipo}...`);
                    
                    this.resetearFormularioProductos();
                    await new Promise(resolve => setTimeout(resolve, 300));
                    
                    const exito = await this.agregarProductoConCategoriaReal(nuevo.categoria, nuevo.tipo, nuevo.config);
                    if (exito) {
                        console.log(`✅ Producto ${i+1} agregado exitosamente`);
                    } else {
                        console.error(`❌ Error agregando producto ${i+1}`);
                    }
                    
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
            
            // 4. FORZAR ACTUALIZACIÓN FINAL
            console.log('4. Forzando actualización final...');
            this.forzarActualizacionCompletaSync();
            
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // 5. MOSTRAR RESUMEN CORREGIDO
            const productosFinales = this.contarProductosReales(); // USAR FUNCIÓN CORREGIDA
            console.log(`\n✅ Edición simplificada completada`);
            console.log(`📊 RESUMEN FINAL CORRECTO: ${productosFinales} productos`);
            
            return true;
            
        } catch (error) {
            console.error('❌ Error en edición simplificada:', error);
            return false;
        }
    },

    // CORREGIDO - Contar solo productos reales (no duplicados)
    contarProductosReales() {
        console.log('📊 Contando productos reales...');
        
        // Método 1: Contar por lista de productos
        const listaProductos = document.getElementById('listaProductos');
        if (listaProductos) {
            const productosEnLista = listaProductos.querySelectorAll('.producto-item, .item-producto, tr, li');
            console.log(`📋 Productos en lista HTML: ${productosEnLista.length}`);
        }
        
        // Método 2: Usar ProductManager si existe
        if (window.app?.productManager?.productos) {
            const productosEnManager = window.app.productManager.productos.length;
            console.log(`📦 Productos en ProductManager: ${productosEnManager}`);
            return productosEnManager;
        }
        
        // Método 3: Contar botones únicos (filtrar duplicados)
        const todosBotones = document.querySelectorAll('button[onclick*="eliminarProducto"]');
        const indicesUnicos = new Set();
        
        todosBotones.forEach(btn => {
            const onclick = btn.getAttribute('onclick');
            const match = onclick.match(/eliminarProducto\((\d+)\)/);
            if (match) {
                indicesUnicos.add(parseInt(match[1]));
            }
        });
        
        const productosUnicos = indicesUnicos.size;
        console.log(`🎯 Productos únicos (filtrado): ${productosUnicos}`);
        console.log(`🔍 Índices encontrados: [${Array.from(indicesUnicos).sort((a,b) => a-b).join(', ')}]`);
        
        return productosUnicos;
    },

    // CORREGIDO - Debug estado completo con conteo correcto
    async debugEstadoCompletoCorregido() {
        console.log('🔍 Debug estado completo (corregido)...');
        
        console.log('\n1. Análisis de productos:');
        const productosReales = this.contarProductosReales();
        
        console.log('\n2. Todos los botones eliminar:');
        const todosBotones = document.querySelectorAll('button[onclick*="eliminarProducto"]');
        console.log(`Total botones encontrados: ${todosBotones.length}`);
        
        // Agrupar por índice para ver duplicados
        const botonesPorIndice = {};
        todosBotones.forEach((btn, i) => {
            const onclick = btn.getAttribute('onclick');
            const match = onclick.match(/eliminarProducto\((\d+)\)/);
            if (match) {
                const indice = parseInt(match[1]);
                if (!botonesPorIndice[indice]) {
                    botonesPorIndice[indice] = [];
                }
                botonesPorIndice[indice].push(i);
            }
        });
        
        console.log('\n📋 Botones por índice de producto:');
        Object.keys(botonesPorIndice).sort((a,b) => a-b).forEach(indice => {
            const botones = botonesPorIndice[indice];
            console.log(`  Producto ${indice}: ${botones.length} botón(es) [posiciones: ${botones.join(', ')}]`);
            if (botones.length > 1) {
                console.warn(`    ⚠️ DUPLICADO detectado para producto ${indice}`);
            }
        });
        
        console.log('\n3. Estado del formulario:');
        const categoriaSelect = document.getElementById('categoriaProducto');
        const tipoSelect = document.getElementById('tipoProducto');
        console.log(`   Categoría disponible: ${categoriaSelect ? 'SÍ' : 'NO'}`);
        console.log(`   Tipo disponible: ${tipoSelect ? 'SÍ' : 'NO'}`);
        
        console.log(`\n✅ PRODUCTOS REALES: ${productosReales}`);
        return productosReales;
    },

    // NUEVA FUNCIÓN - Resetear formulario de productos
    resetearFormularioProductos() {
        console.log('🔄 Reseteando formulario de productos...');
        
        try {
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

    // CORREGIDO - Cambiar nombre de función para evitar confusión
    forzarActualizacionCompletaSync() {
        console.log('🔄 Forzando actualización síncrona...');
        
        // Ejecutar todas las actualizaciones posibles
        this.forzarActualizacionCompleta();
        
        // Actualización adicional después de un delay
        setTimeout(() => {
            this.forzarActualizacionCompleta();
            
            // Verificar y reportar estado
            const productosActuales = this.contarProductosReales();
            console.log(`📊 Verificación post-actualización: ${productosActuales} productos`);
        }, 500);
    },

    // NUEVA FUNCIÓN - Investigar qué funciones de actualización realmente existen
    investigarFuncionesActualizacion() {
        console.log('🔍 Investigando funciones de actualización disponibles...');
        
        // 1. Verificar window.app
        if (window.app) {
            console.log('📦 window.app existe');
            console.log('   - productManager:', typeof window.app.productManager);
            
            if (window.app.productManager) {
                console.log('   - productos array:', Array.isArray(window.app.productManager.productos));
                console.log('   - cantidad productos:', window.app.productManager.productos?.length || 0);
                
                // Listar métodos del productManager
                const metodos = Object.getOwnPropertyNames(Object.getPrototypeOf(window.app.productManager))
                    .filter(prop => typeof window.app.productManager[prop] === 'function');
                console.log('   - métodos disponibles:', metodos);
            }
            
            if (window.app.exportManager) {
                const metodosExport = Object.getOwnPropertyNames(Object.getPrototypeOf(window.app.exportManager))
                    .filter(prop => typeof window.app.exportManager[prop] === 'function');
                console.log('   - exportManager métodos:', metodosExport);
            }
        } else {
            console.log('❌ window.app no existe');
        }
        
        // 2. Verificar funciones globales
        const funcionesGlobales = [
            'calcularTotal',
            'actualizarVista', 
            'actualizarCotizacion',
            'renderizarLista',
            'actualizarHTML',
            'refrescarLista',
            'actualizarProductos',
            'mostrarProductos',
            'generarCotizacion',
            'actualizarTotal'
        ];
        
        console.log('\n🌐 Funciones globales:');
        funcionesGlobales.forEach(nombreFuncion => {
            if (typeof window[nombreFuncion] === 'function') {
                console.log(`✅ ${nombreFuncion} - EXISTE`);
            } else {
                console.log(`❌ ${nombreFuncion} - NO existe`);
            }
        });
        
        // 3. Verificar el DOM actual
        console.log('\n🏗️ Estado del DOM:');
        const listaProductos = document.getElementById('listaProductos');
        if (listaProductos) {
            console.log(`   - listaProductos: ${listaProductos.children.length} elementos`);
            console.log(`   - innerHTML length: ${listaProductos.innerHTML.length} caracteres`);
            
            if (listaProductos.children.length > 0) {
                console.log(`   - primer elemento: ${listaProductos.children[0].tagName}`);
            }
 }
        
        // 4. Buscar funciones que contengan "render" o "update"
        console.log('\n🔍 Buscando funciones con "render" o "update":');
        for (let prop in window) {
            if (typeof window[prop] === 'function' && 
                (prop.toLowerCase().includes('render') || 
                 prop.toLowerCase().includes('update') ||
                 prop.toLowerCase().includes('refresh'))) {
                console.log(`✅ Encontrada: ${prop}`);
            }
        }
    },

    // NUEVA FUNCIÓN - Test de actualización paso a paso
    async testActualizacionPasoAPaso() {
        console.log('🧪 Test de actualización paso a paso...');
        
        // 1. Estado inicial
        const productosInicial = this.contarProductosReales();
        console.log(`📊 Productos inicial: ${productosInicial}`);
        
        // 2. Agregar un producto simple
        console.log('\n➕ Agregando producto de prueba...');
        const exito = await this.agregarProductoConCategoriaReal('cajas', '1', {base: 123, altura: 456});
        
        if (exito) {
            console.log('✅ Producto agregado según función');
            
            // 3. Verificar cambio en el array
            const productosEnArray = window.app?.productManager?.productos?.length || 0;
            console.log(`📦 Productos en array: ${productosEnArray}`);
            
            // 4. Verificar cambio en DOM
            await new Promise(resolve => setTimeout(resolve, 100));
            const productosEnDOM = this.contarProductosReales();
            console.log(`🏗️ Productos en DOM: ${productosEnDOM}`);
            
            // 5. Intentar diferentes métodos de actualización
            console.log('\n🔄 Probando métodos de actualización...');
            
            if (window.app?.productManager?.actualizarListaHTML) {
                window.app.productManager.actualizarListaHTML();
                console.log('✅ actualizarListaHTML() ejecutada');
                
                await new Promise(resolve => setTimeout(resolve, 200));
                const productosDespuesHTML = this.contarProductosReales();
                console.log(`📊 Productos después de actualizarListaHTML: ${productosDespuesHTML}`);
            }
            
            if (window.app?.productManager?.renderizarLista) {
                window.app.productManager.renderizarLista();
                console.log('✅ renderizarLista() ejecutada');
                
                await new Promise(resolve => setTimeout(resolve, 200));
                const productosDespuesRender = this.contarProductosReales();
                console.log(`📊 Productos después de renderizarLista: ${productosDespuesRender}`);
            }
            
            if (typeof actualizarTotal === 'function') {
                actualizarTotal();
                console.log('✅ actualizarTotal() ejecutada');
            }
            
        } else {
            console.error('❌ Error agregando producto de prueba');
        }
    },

    // NUEVA FUNCIÓN - Forzar actualización específica basada en investigación
    forzarActualizacionEspecifica() {
        console.log('🎯 Forzando actualización específica...');
        
        try {
            let actualizacionesRealizadas = 0;
            
            // 1. Método principal: ProductManager
            if (window.app?.productManager) {
                console.log('📦 Usando ProductManager...');
                
                // Intentar métodos comunes de ProductManager
                const metodosProductManager = [
                    'actualizarListaHTML',
                    'renderizarLista', 
                    'actualizarTotal',
                    'render',
                    'mostrarProductos',
                    'generarHTML',
                    'renderizar'
                ];
                
                metodosProductManager.forEach(metodo => {
                    if (typeof window.app.productManager[metodo] === 'function') {
                        try {
                            window.app.productManager[metodo]();
                            console.log(`✅ ${metodo}() ejecutado`);
                            actualizacionesRealizadas++;
                        } catch (error) {
                            console.warn(`⚠️ Error en ${metodo}:`, error);
                        }
                    }
                });
            }
            
            // 2. Método alternativo: Funciones globales
            const funcionesGlobalesImportantes = [
                'actualizarTotal',
                'calcularTotal', 
                'mostrarProductos',
                'renderizarProductos',
                'actualizarVista'
            ];
            
            funcionesGlobalesImportantes.forEach(nombreFuncion => {
                if (typeof window[nombreFuncion] === 'function') {
                    try {
                        window[nombreFuncion]();
                        console.log(`✅ ${nombreFuncion}() ejecutado`);
                        actualizacionesRealizadas++;
                    } catch (error) {
                        console.warn(`⚠️ Error en ${nombreFuncion}:`, error);
                    }
                }
            });
            
            // 3. Método DOM: Re-insertar contenido
            const listaProductos = document.getElementById('listaProductos');
            if (listaProductos && window.app?.productManager?.productos) {
                console.log('🔄 Forzando re-render del DOM...');
                
                // Guardar contenido actual
                const contenidoActual = listaProductos.innerHTML;
                
                // Limpiar y volver a insertar
                listaProductos.innerHTML = '';
                setTimeout(() => {
                    listaProductos.innerHTML = contenidoActual;
                    
                    // Ejecutar actualización específica si existe
                    if (window.app?.productManager?.actualizarListaHTML) {
                        window.app.productManager.actualizarListaHTML();
                    }
                    
                    console.log('🔄 DOM re-renderizado forzadamente');
                }, 50);
                
                actualizacionesRealizadas++;
            }
            
            // 4. Trigger eventos globales del documento
            console.log('4. Disparando eventos globales...');
            const eventosATriggerear = [
                'DOMContentLoaded',
                'load',
                'change',
                'input',
                'click'
            ];
            
            eventosATriggerear.forEach(evento => {
                document.dispatchEvent(new Event(evento, { bubbles: true }));
            });
            
            console.log(`✅ Actualizaciones realizadas: ${actualizacionesRealizadas}`);
            return actualizacionesRealizadas > 0;
            
        } catch (error) {
            console.error('❌ Error en actualización específica:', error);
            return false;
        }
    },

    // NUEVA FUNCIÓN - Actualización específica para tu aplicación (sin window.app)
    forzarActualizacionRealParaTuApp() {
        console.log('🔄 Forzando actualización específica para tu aplicación...');
        
        try {
            let actualizacionesRealizadas = 0;
            
            // 1. Buscar funciones específicas de tu app
            console.log('1. Buscando funciones específicas...');
            
            // Estas son las funciones que probablemente SÍ tienes
            const funcionesQueDeberianExistir = [
                'mostrarFormulario',
                'generarCotizacionDesdeForm', 
                'agregarProducto',
                'eliminarProducto',
                'editarCotizacion',
                'guardarEdicion',
                'cerrarEdicion'
            ];
            
            funcionesQueDeberianExistir.forEach(nombreFuncion => {
                if (typeof window[nombreFuncion] === 'function') {
                    console.log(`✅ ${nombreFuncion} - EXISTE`);
                    actualizacionesRealizadas++;
                } else {
                    console.log(`❌ ${nombreFuncion} - NO existe`);
                }
            });
            
            // 2. Intentar regenerar la cotización completa
            console.log('2. Intentando regenerar cotización...');
            if (typeof generarCotizacionDesdeForm === 'function') {
                try {
                    generarCotizacionDesdeForm();
                    console.log('✅ generarCotizacionDesdeForm() ejecutada');
                    actualizacionesRealizadas++;
                } catch (error) {
                    console.warn('⚠️ Error en generarCotizacionDesdeForm:', error);
                }
            }
            
            // 3. Forzar re-render del DOM mediante manipulación directa
            console.log('3. Forzando actualización del DOM...');
            const listaProductos = document.getElementById('listaProductos');
            
            if (listaProductos) {
                // Método 1: Trigger eventos
                listaProductos.dispatchEvent(new Event('change', { bubbles: true }));
                listaProductos.dispatchEvent(new Event('input', { bubbles: true }));
                
                // Método 2: Re-insertar contenido
                const contenido = listaProductos.innerHTML;
                listaProductos.innerHTML = '';
                setTimeout(() => {
                    listaProductos.innerHTML = contenido;
                    console.log('🔄 Contenido de listaProductos reinsertado');
                }, 100);
                
                actualizacionesRealizadas++;
            }
            
            // 4. Trigger eventos globales del documento
            console.log('4. Disparando eventos globales...');
            const eventosATriggerear = [
                'DOMContentLoaded',
                'load',
                'change',
                'input',
                'click'
            ];
            
            eventosATriggerear.forEach(evento => {
                document.dispatchEvent(new Event(evento, { bubbles: true }));
            });
            
            console.log(`✅ Actualizaciones realizadas: ${actualizacionesRealizadas}`);
            return actualizacionesRealizadas > 0;
            
        } catch (error) {
            console.error('❌ Error en actualización real:', error);
            return false;
        }
    },

    // NUEVA FUNCIÓN - Detectar cómo funciona realmente tu aplicación
    investigarAplicacionReal() {
        console.log('🔍 Investigando cómo funciona realmente tu aplicación...');
        
        // 1. Buscar variables globales importantes
        console.log('\n📦 Variables globales importantes:');
        const variablesImportantes = [
            'productos', 'cliente', 'cotizacion', 'formData', 
            'productosLista', 'total', 'subtotal'
        ];
        
        variablesImportantes.forEach(variable => {
            if (typeof window[variable] !== 'undefined') {
                console.log(`✅ ${variable}:`, typeof window[variable], window[variable]);
            } else {
                console.log(`❌ ${variable} - NO existe`);
            }
        });
        
        // 2. Investigar scripts cargados
        console.log('\n📜 Scripts cargados:');
        const scripts = document.querySelectorAll('script[src]');
        scripts.forEach((script, i) => {
            const src = script.src.split('/').pop();
            console.log(`${i+1}. ${src}`);
        });
        
        // 3. Buscar eventos en elementos clave
        console.log('\n🔗 Elementos con eventos:');
        const elementosConEventos = document.querySelectorAll('[onclick], [onchange], [oninput]');
        console.log(`Elementos con eventos encontrados: ${elementosConEventos.length}`);
        
        elementosConEventos.forEach((el, i) => {
            if (i < 10) { // Solo mostrar los primeros 10
                const eventos = [];
                if (el.onclick) eventos.push(`onclick="${el.onclick}"`);
                if (el.onchange) eventos.push(`onchange="${el.onchange}"`);
                if (el.oninput) eventos.push(`oninput="${el.oninput}"`);
                
                console.log(`${i+1}. ${el.tagName} - ${eventos.join(', ')}`);
            }
        });
        
        // 4. Investigar contenido del localStorage/sessionStorage
        console.log('\n💾 Almacenamiento local:');
        try {
            if (localStorage.length > 0) {
                console.log(`localStorage items: ${localStorage.length}`);
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    console.log(`  - ${key}: ${localStorage.getItem(key)?.substring(0, 50)}...`);
                }
            } else {
                console.log('localStorage vacío');
            }
        } catch (error) {
            console.log('Error accediendo a localStorage:', error);
        }
    },

    // NUEVA FUNCIÓN - Método de actualización adaptado a tu app
    async forzarActualizacionSinWindowApp() {
        console.log('🔄 Forzando actualización SIN window.app...');
        
        try {
            // 1. Verificar si hay productos agregados en alguna variable global
            console.log('1. Buscando productos en variables globales...');
            
            // Buscar arrays que puedan contener productos
            for (let prop in window) {
                if (Array.isArray(window[prop]) && window[prop].length > 0) {
                    console.log(`📦 Array encontrado: ${prop} con ${window[prop].length} elementos`);
                    
                    // Si parece ser de productos, intentar logging
                    if (prop.toLowerCase().includes('producto') || 
                        prop.toLowerCase().includes('item') ||
                        window[prop][0]?.hasOwnProperty?.('categoria') ||
                        window[prop][0]?.hasOwnProperty?.('tipo')) {
                        
                        console.log(`🎯 Posible array de productos: ${prop}`);
                        console.log('Primer elemento:', window[prop][0]);
                    }
                }
            }
            
            // 2. Intentar regeneración manual del HTML
            console.log('2. Intentando regeneración manual...');
            
            const listaProductos = document.getElementById('listaProductos');
            if (listaProductos) {
                // Simular clic en botón "Generar Cotización" si existe
                const botonGenerar = document.querySelector('button[onclick*="generar"], .btn-generar');
                if (botonGenerar) {
                    console.log('🔘 Haciendo clic en botón generar...');
                    botonGenerar.click();
                    return true;
                }
                
                // Si no hay botón, intentar forzar con contenido actual
                const contenidoActual = listaProductos.innerHTML;
                listaProductos.innerHTML = '';
                setTimeout(() => {
                    listaProductos.innerHTML = contenidoActual;
                    console.log('🔄 Contenido de listaProductos reinsertado');
                }, 100);
                
                return true;
            }
            
            // 3. Buscar función de actualización específica de tu app
            console.log('3. Buscando función de actualización específica...');
            
            // Intentar variaciones del nombre de actualización
            const posiblesNombres = [
                'actualizarLista',
                'refreshList', 
                'updateList',
                'renderProductos',
                'showProducts',
                'displayProducts',
                'generateList'
            ];
            
            for (const nombre of posiblesNombres) {
                if (typeof window[nombre] === 'function') {
                    console.log(`✅ Función encontrada: ${nombre}`);
                    try {
                        window[nombre]();
                        console.log(`✅ ${nombre}() ejecutada exitosamente`);
                        return true;
                    } catch (error) {
                        console.warn(`⚠️ Error ejecutando ${nombre}:`, error);
                    }
                }
            }
            
            console.log('🔍 No se encontraron funciones de actualización automática');
            console.log('💡 Tu app requiere actualización manual o refrescar página');
            
            return false;
            
        } catch (error) {
            console.error('❌ Error en actualización sin window.app:', error);
            return false;
        }
    },

    // NUEVA FUNCIÓN - Solución temporal hasta que sepamos más
    async agregarProductoConActualizacionManual(categoria, tipo, config = {}) {
        console.log(`🎯 Agregando ${categoria} -> tipo ${tipo} (con actualización manual)...`);
        
        try {
            // 1. Agregar el producto normalmente
            const exito = await this.agregarProductoConCategoriaReal(categoria, tipo, config);
            
            if (exito) {
                console.log('✅ Producto agregado al sistema');
                
                // 2. Intentar múltiples métodos de actualización
                console.log('🔄 Intentando métodos de actualización...');
                
                // Método 1: Forzar regeneración de cotización
                const botonGenerar = document.querySelector('button[onclick*="generarCotizacionDesdeForm"], .btn-generar');
                if (botonGenerar) {
                    console.log('🔘 Regenerando cotización...');
                    botonGenerar.click();
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
                
                // Método 2: Usar nuestra actualización específica
                await this.forzarActualizacionSinWindowApp();
                
                // Método 3: Forzar actualización del DOM
                this.forzarActualizacionRealParaTuApp();
                
                console.log('✅ Producto agregado con actualización manual');
                return true;
            }
            
            return false;
            
        } catch (error) {
            console.error('❌ Error agregando producto con actualización manual:', error);
            return false;
        }
    }
};