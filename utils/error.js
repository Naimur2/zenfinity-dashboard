import Cookies from 'js-cookie';
import { toast } from 'react-toastify';


export function apiError(error){
    console.log(error ?.response ?.data);
    if(error ?.response ?.data ?.errors){
        let err = error.response.data.errors;
        for(let i=0; i<err.length; i++){
            toast.error(err[i].errorList ? err[i].errorList[i] : err[i]);
        }
        if(error.response.status === 401){
            Cookies.remove('token');
            Cookies.remove('username');
            window.location = '/login';
        }
    }
}