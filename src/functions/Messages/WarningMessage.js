import { toast, Zoom } from 'react-toastify';

export function showWarningMessage(message) {
    toast.warn(message, {
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
