function mostrarFormularioEnEdicion() {
    console.log('📋 Mostrando formulario para agregar producto en edición...');
    
    const formularioNuevoProducto = document.getElementById('formularioNuevoProducto');
    
    if (formularioNuevoProducto) {
        const estaVisible = formularioNuevoProducto.style.display === 'block';
        
        if (!estaVisible) {
            // Mostrar formulario
            formularioNuevoProducto.style.display = 'block';
            console.log('✅ Formulario de nuevo producto mostrado');
            
            // Cambiar texto del botón
            const botonMostrar = document.querySelector('button[onclick="mostrarFormularioEnEdicion()"]');
            if (botonMostrar) {
                botonMostrar.textContent = 'Ocultar Formulario';
                botonMostrar.style.backgroundColor = '#dc3545';
            }
            
            // Configurar eventos del formulario de edición
            configurarFormularioEdicion();
            
        } else {
            // Ocultar formulario
            formularioNuevoProducto.style.display = 'none';
            console.log('🙈 Formulario de nuevo producto ocultado');
            
            // Restaurar texto del botón
            const botonMostrar = document.querySelector('button[onclick="mostrarFormularioEnEdicion()"]');
            if (botonMostrar) {
                botonMostrar.textContent = 'Agregar Nuevo Producto';
                botonMostrar.style.backgroundColor = '';
            }
        }
    } else {
        console.error('❌ No se encontró el elemento formularioNuevoProducto');
        alert('Error: No se encontró el formulario para agregar productos');
    }
}

function configurarFormularioEdicion() {
    console.log('🔧 Configurando eventos del formulario de edición...');
    
    // Configurar categoría edición
    const categoriaEdicion = document.getElementById('categoriaProductoEdicion');
    if (categoriaEdicion) {
        // Limpiar eventos previos
        const nuevoSelect = categoriaEdicion.cloneNode(true);
        categoriaEdicion.parentNode.replaceChild(nuevoSelect, categoriaEdicion);
        
        nuevoSelect.addEventListener('change', function() {
            console.log('📁 Categoría edición seleccionada:', this.value);
            
            if (window.app && window.app.categoryManager) {
                window.app.categoryManager.actualizarSubcategorias({
                    categoria: this.value,
                    esEdicion: true
                });
            }
        });
        console.log('✅ Evento categoría edición configurado');
    }
    
    // Configurar tipo producto edición  
    const tipoEdicion = document.getElementById('tipoProductoEdicion');
    if (tipoEdicion) {
        // Limpiar eventos previos
        const nuevoTipo = tipoEdicion.cloneNode(true);
        tipoEdicion.parentNode.replaceChild(nuevoTipo, tipoEdicion);
        
        nuevoTipo.addEventListener('change', function() {
            console.log('🔧 Tipo producto edición seleccionado:', this.value);
            
            if (window.app && window.app.formManager) {
                window.app.formManager.mostrarCamposEspecificos(this.value, true);
            }
        });
        console.log('✅ Evento tipo producto edición configurado');
    }
    
    console.log('✅ Formulario de edición configurado completamente');
}
