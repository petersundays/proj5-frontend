import { toast, Zoom } from 'react-toastify';

export function showInfoMessage(message) {
    toast.info(message, {
        
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