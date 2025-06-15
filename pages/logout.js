import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import api from '../utils/api';
import routes from '../utils/routes';
import { apiError } from '../utils/error';
import Loader from '../components/loader/loader';

export default function Logout() {
    const router = useRouter();



    useEffect(  () => {
       
        Cookies.remove('token');
        Cookies.remove('logo');
        Cookies.remove('username');
        api.defaults.headers.Authorization = null;
        router.push('/login');
    }, [])

    return (
        <>
        <Loader />
        <ToastContainer />
        </>
    )
}