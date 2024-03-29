import { toast, Zoom } from 'react-toastify';

export function showErrorMessage(message) {
    toast.error(message, {
        
        theme: "colored",
        position: "top-center",
        transition: Zoom,
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
    });
}
