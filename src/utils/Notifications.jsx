import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const notify = (message, type = 'info', time = 3000) => {
  toast(message, {
    position: "top-right",
    autoClose: time,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    type: type,
  });
};
