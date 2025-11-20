export class CategoryManager {
    constructor() {
        this.categorias = {
            cajas: [
                { value: '1', text: 'Caja de Acrílico' },
                { value: '2', text: 'Caja de Lona' },
                { value: '9', text: 'Caja Circular' }
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
        const selectTipo = document.getElementById(esEdicion ? 'tipoProductoEdicion' : 'tipoProducto');
        const divSubcategorias = document.getElementById(esEdicion ? 'subcategoriasEdicion' : 'subcategorias');
        
        if (!categoria || categoria === '') {
            divSubcategorias.style.display = 'none';
            selectTipo.innerHTML = '<option value="">Seleccione el tipo...</option>';
            return;
        }

        // Caso especial para neón: mostrar directamente las opciones específicas
        if (categoria === 'neon') {
            divSubcategorias.style.display = 'none';
            if (formManager) {
                formManager.ocultarTodosLosCampos(esEdicion);
                // Mostrar medidas básicas para neón
                const medidas = document.getElementById(esEdicion ? 'medidasEdicion' : 'medidas');
                if (medidas) medidas.style.display = 'block';
                // Mostrar directamente las opciones de neón
                const opcionesNeon = document.getElementById(esEdicion ? 'opcionesNeonEdit' : 'opcionesNeon');
                if (opcionesNeon) opcionesNeon.style.display = 'block';
            }
            return;
        }

        // Para el resto de categorías, mostrar div de subcategorías
        divSubcategorias.style.display = 'block';

        // Limpiar y llenar opciones
        selectTipo.innerHTML = '<option value="">Seleccione el tipo...</option>';
        
        if (this.categorias[categoria]) {
            this.categorias[categoria].forEach(producto => {
                const option = document.createElement('option');
                option.value = producto.value;
                option.textContent = producto.text;
                selectTipo.appendChild(option);
            });
        }
    }

    // Configurar event listeners para las categorías
    setupEventListeners(formManager) {
        // Para formulario principal
        const categoriaSelect = document.getElementById('categoriaProducto');
        if (categoriaSelect) {
            categoriaSelect.addEventListener('change', (e) => {
                this.actualizarSubcategorias(e.target.value, false, formManager);
                // Solo ocultar campos si no es neón (ya que neón los muestra directamente)
                if (e.target.value !== 'neon') {
                    formManager.ocultarTodosLosCampos(false);
                }
            });
        }

        // Para formulario de edición
        const categoriaSelectEdicion = document.getElementById('categoriaProductoEdicion');
        if (categoriaSelectEdicion) {
            categoriaSelectEdicion.addEventListener('change', (e) => {
                this.actualizarSubcategorias(e.target.value, true, formManager);
                // Solo ocultar campos si no es neón (ya que neón los muestra directamente)
                if (e.target.value !== 'neon') {
                    formManager.ocultarTodosLosCampos(true);
                }
            });
        }

        // Event listeners para cuando se selecciona el tipo específico
        const tipoProducto = document.getElementById('tipoProducto');
        if (tipoProducto) {
            tipoProducto.addEventListener('change', (e) => {
                if (e.target.value) {
                    formManager.mostrarCamposEspecificos(e.target.value, false);
                }
            });
        }

        const tipoProductoEdicion = document.getElementById('tipoProductoEdicion');
        if (tipoProductoEdicion) {
            tipoProductoEdicion.addEventListener('change', (e) => {
                if (e.target.value) {
                    formManager.mostrarCamposEspecificos(e.target.value, true);
                }
            });
        }
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