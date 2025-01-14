import Swal from "sweetalert2";

export const showError = (message) => {
    Swal.fire({
        title: 'Error',
        text: message || 'Ha ocurrido un error',
        icon: 'error',
        confirmButtonText: 'Aceptar'
    });
};

export const showSuccess = (message) => {
    Swal.fire({
        title: 'Éxito',
        text: message || 'Operación realizada con éxito',
        icon: 'success',
        confirmButtonText: 'Aceptar'
    });
}

export const showConfirm = async (...options) => {
    return Swal.fire({
        title: 'Confirmación',
        text: options[0] || '¿Estás seguro de realizar esta operación?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: options[1] || 'Aceptar',
        cancelButtonText: options[2] || 'Cancelar'
    });
}