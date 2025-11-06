export const Helpers = {
    formatearNumero(numero) {
        return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    mostrarMensaje(mensaje, tipo) {
        const mensajesDiv = document.getElementById("mensajes");
        const estilos = {
            success: 'color: green; background: #d4edda; border: 1px solid #c3e6cb; padding: 10px; border-radius: 4px; margin: 10px 0;',
            error: 'color: #721c24; background: #f8d7da; border: 1px solid #f5c6cb; padding: 10px; border-radius: 4px; margin: 10px 0;',
            info: 'color: #0c5460; background: #d1ecf1; border: 1px solid #bee5eb; padding: 10px; border-radius: 4px; margin: 10px 0;'
        };
        
        mensajesDiv.innerHTML = `<div style="${estilos[tipo] || estilos.info}">${mensaje}</div>`;
        setTimeout(() => { mensajesDiv.innerHTML = ""; }, 3000);
    },

    limpiarFormulario(campos) {
        campos.forEach(id => {
            const elemento = document.getElementById(id);
            if (elemento) {
                if (elemento.type === 'checkbox') {
                    elemento.checked = false;
                } else {
                    elemento.value = '';
                }
            }
        });
    }
};