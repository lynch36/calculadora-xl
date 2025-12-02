export class CategoryManager {
    constructor() {
        this.categorias = {
            cajas: [
                { value: '1', text: 'Caja de Acrílico' },
                { value: '2', text: 'Caja de Lona' },
                { value: '9', text: 'Caja Circular' },
                { value: '11', text: 'Caja de Doble Vista' } // AGREGAR esta línea
            ],
            neon: [
                { value: '3', text: 'Neón' }
            ],
            impresion: [
                { value: '4', text: 'Impresión Lona' },
                { value: '5', text: 'Impresión Vinil' }
            ],
            letras: [
                { value: '6', text: 'Letras 3D' },
                { value: '7', text: 'Letras Planas' }
            ],
            banner: [
                { value: '8', text: 'Banner Lona' }
            ],
            otros: [
                { value: '10', text: 'Producto Personalizado' }
            ]
        };
    }

    // Actualizar subcategorías según la categoría seleccionada
    actualizarSubcategorias(categoria, esEdicion = false, formManager = null) {
        console.log('🔄 actualizarSubcategorias llamado:', { categoria, esEdicion });
        
        const selectTipo = document.getElementById(esEdicion ? 'tipoProductoEdicion' : 'tipoProducto');
        const divSubcategorias = document.getElementById(esEdicion ? 'subcategoriasEdicion' : 'subcategorias');
        
        console.log('🔍 Elementos encontrados:', {
            selectTipo: !!selectTipo,
            divSubcategorias: !!divSubcategorias,
            formManager: !!formManager
        });
        
        if (!categoria || categoria === '') {
            console.log('❌ Sin categoría seleccionada, ocultando subcategorías');
            if (divSubcategorias) divSubcategorias.style.display = 'none';
            if (selectTipo) selectTipo.innerHTML = '<option value="">Seleccione el tipo...</option>';
            return;
        }

        // Caso especial para neón: mostrar directamente las opciones específicas
        if (categoria === 'neon') {
            console.log('⚡ Categoría neón detectada, mostrando campos directamente');
            if (divSubcategorias) divSubcategorias.style.display = 'none';
            if (formManager) {
                formManager.ocultarTodosLosCampos(esEdicion);
                // Mostrar medidas básicas para neón
                const medidas = document.getElementById(esEdicion ? 'medidasEdicion' : 'medidas');
                if (medidas) {
                    medidas.style.display = 'block';
                    console.log('✅ Medidas mostradas para neón');
                }
                // Mostrar directamente las opciones de neón
                const opcionesNeon = document.getElementById(esEdicion ? 'opcionesNeonEdit' : 'opcionesNeon');
                if (opcionesNeon) {
                    opcionesNeon.style.display = 'block';
                    console.log('✅ Opciones neón mostradas');
                }
            }
            return;
        }

        // Para el resto de categorías, mostrar div de subcategorías
        console.log('📋 Mostrando subcategorías para:', categoria);
        if (divSubcategorias) {
            divSubcategorias.style.display = 'block';
            console.log('✅ Div subcategorías mostrado');
        }

        // Limpiar y llenar opciones
        if (selectTipo) {
            selectTipo.innerHTML = '<option value="">Seleccione el tipo...</option>';
            
            if (this.categorias[categoria]) {
                console.log(`📦 Agregando ${this.categorias[categoria].length} opciones para ${categoria}`);
                this.categorias[categoria].forEach(producto => {
                    const option = document.createElement('option');
                    option.value = producto.value;
                    option.textContent = producto.text;
                    selectTipo.appendChild(option);
                    console.log(`  ➕ Agregado: ${producto.text} (${producto.value})`);
                });
                console.log('✅ Subcategorías cargadas correctamente');
            } else {
                console.error('❌ No se encontraron productos para la categoría:', categoria);
            }
        } else {
            console.error('❌ No se encontró selectTipo');
        }
    }

    // Configurar event listeners para las categorías
    setupEventListeners(formManager) {
        console.log('🔧 Configurando event listeners de CategoryManager...');
        
        // Para formulario principal
        const categoriaSelect = document.getElementById('categoriaProducto');
        if (categoriaSelect) {
            console.log('✅ Encontrado categoriaProducto, agregando event listener...');
            categoriaSelect.addEventListener('change', (e) => {
                console.log('📂 Categoría cambiada:', e.target.value);
                this.actualizarSubcategorias(e.target.value, false, formManager);
                // Solo ocultar campos si no es neón (ya que neón los muestra directamente)
                if (e.target.value !== 'neon') {
                    formManager.ocultarTodosLosCampos(false);
                }
            });
        } else {
            console.error('❌ No se encontró elemento categoriaProducto');
        }

        // Para formulario de edición
        const categoriaSelectEdicion = document.getElementById('categoriaProductoEdicion');
        if (categoriaSelectEdicion) {
            console.log('✅ Encontrado categoriaProductoEdicion, agregando event listener...');
            categoriaSelectEdicion.addEventListener('change', (e) => {
                console.log('📂 Categoría edición cambiada:', e.target.value);
                this.actualizarSubcategorias(e.target.value, true, formManager);
                // Solo ocultar campos si no es neón (ya que neón los muestra directamente)
                if (e.target.value !== 'neon') {
                    formManager.ocultarTodosLosCampos(true);
                }
            });
        } else {
            console.error('❌ No se encontró elemento categoriaProductoEdicion');
        }

        // Event listeners para cuando se selecciona el tipo específico
        const tipoProducto = document.getElementById('tipoProducto');
        if (tipoProducto) {
            console.log('✅ Encontrado tipoProducto, agregando event listener...');
            tipoProducto.addEventListener('change', (e) => {
                console.log('🔧 Tipo producto cambiado:', e.target.value);
                if (e.target.value) {
                    formManager.mostrarCamposEspecificos(e.target.value, false);
                }
            });
        } else {
            console.error('❌ No se encontró elemento tipoProducto');
        }

        const tipoProductoEdicion = document.getElementById('tipoProductoEdicion');
        if (tipoProductoEdicion) {
            console.log('✅ Encontrado tipoProductoEdicion, agregando event listener...');
            tipoProductoEdicion.addEventListener('change', (e) => {
                console.log('🔧 Tipo producto edición cambiado:', e.target.value);
                if (e.target.value) {
                    formManager.mostrarCamposEspecificos(e.target.value, true);
                }
            });
        } else {
            console.error('❌ No se encontró elemento tipoProductoEdicion');
        }
        
        console.log('✅ Event listeners de CategoryManager configurados');
    }

    // Limpiar selecciones
    limpiarSelecciones(esEdicion = false) {
        const categoriaSelect = document.getElementById(esEdicion ? 'categoriaProductoEdicion' : 'categoriaProducto');
        const tipoSelect = document.getElementById(esEdicion ? 'tipoProductoEdicion' : 'tipoProducto');
        const divSubcategorias = document.getElementById(esEdicion ? 'subcategoriasEdicion' : 'subcategorias');
        
        if (categoriaSelect) categoriaSelect.value = '';
        if (tipoSelect) tipoSelect.value = '';
        if (divSubcategorias) divSubcategorias.style.display = 'none';
    }

    // Obtener categoría por tipo de producto (para funciones existentes)
    obtenerCategoriaPorTipo(tipo) {
        for (const [categoria, productos] of Object.entries(this.categorias)) {
            if (productos.some(p => p.value === tipo)) {
                return categoria;
            }
        }
        return null;
    }
}