export const Calculations = {
    multiplicacionArea(base, altura, precio) {
        return parseFloat(((base * altura) * (precio / 10000)).toFixed(2));
    },

    sumaAltura(altura, precio) {
        return altura * precio;
    },

    sumaArea(base, altura, precio) {
        return (base + altura) * precio;
    },

    calcularIVA(subtotal) {
        return subtotal * 0.16;
    },

    calcularTotal(subtotal, conIVA = false) {
        let total = subtotal;
        
        if (conIVA) {
            total += this.calcularIVA(subtotal);
        }
        
        return total;
    }
};