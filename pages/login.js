import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { LoadingButton } from '@mui/lab';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, TextField, Typography, InputAdornment, Button, } from '@mui/material';

import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import api from '../utils/api';
import routes from '../utils/routes';
import { apiError } from '../utils/error';
import styles from '../styles/auth.module.scss';

export default function Login() {

    const router = useRouter();
    const [authData, setAuthData] = useState({
        email: '',
        password: ''
    })
    const [authDataError, setAuthDataError] = useState({
        email: { status: false, message: '' },
        otp: { status: false, message: '' },
        password: { status: false, message: '' },
    })
    const [loading, setLoading] = React.useState(false);
    const [isShowOTP, setShowOTP] = useState(false);
    const [isShowOTPMail, setShowOTPMail] = useState(false);
    const [isShowPassword, setShowPassword] = useState(false);
    const [isShowOTPMailTime, setShowOTPMailTime] = useState(30);
    const [isShowForgotPassword, setShowForgotPassword] = useState(false);
    const [showPassword, setEyeShowPassword] = useState(false);


    const handleTogglePassword = () => {
        setEyeShowPassword((prevState) => !prevState);
    };
    const handleChange = (e) => {
        setAuthData({ ...authData, [e.target.name]: e.target.value });
        setAuthDataError({ ...authDataError, [e.target.name]: { status: false, message: '' } });
    };

    const ValidateEmail = email => {
        return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(email)
    }

    const validateLogin = () => {
        const { password } = authData;
        let isError = false;
        if (!password || !password.length) {
            isError = true;
            setAuthDataError({ ...authDataError, password: { status: true, message: 'Please Enter Password' } });
        }
        return isError? !isError: authData;
    }

    const login = () => {
        const data = validateLogin();
        
        if (data) {
            setLoading(true);
            api.post(routes.AUTH.LOG_IN, data)
            .then(res => res.data)
            .then(data => {
                setLoading(false);
                let expiredTime = new Date(new Date().setMinutes(new Date().getMinutes()+180));
                if(data.isURL) Cookies.set('logo', data.url, { expires: expiredTime })
                Cookies.set('token', data.token, { expires: expiredTime })
                Cookies.set('username', data.name, { expires: expiredTime })
                api.defaults.headers.Authorization = `${data.token}`
                router.push('/home')
            })
            .catch(err => {
                setLoading(false);
                apiError(err);
            })
        }
    }

      
    React.useEffect(() => {
        if( isShowOTP && isShowOTPMail && isShowOTPMailTime > 0 ){
            setTimeout(() => {
                setShowOTPMailTime(isShowOTPMailTime-1)
            }, 1000)
        }
    }, [isShowOTP, isShowOTPMail, isShowOTPMailTime])

    React.useEffect(() => {
        Cookies.remove('logo');
        Cookies.remove('token');
        Cookies.remove('username');
    }, [])
    
    return (
        <>
            <Box className={styles.loginContainer}>
                <Box className={styles.logoHeader}>
                    <Box className={styles.imgBox}>
                        {/* <Image alt="logo" src={logo} height={50} width={200} /> */}
                    </Box>
                </Box>
                <Box className={styles.authBox}>
                    <Typography component='h4' variant='h4'>Log in to your account</Typography>

                    <Box className={styles.common_box_input}>
                        <label>Email Address</label>
                        <TextField 
                            disabled={isShowForgotPassword}
                            error={authDataError.email.status}
                            helperText={authDataError.email.message}
                            value={authData.email}
                            name="email"
                            placeholder='Email Address'
                            required
                            size="small"
                            type="text"
                            id="outlined-start-adornment"
                            onChange={handleChange}
                            sx={{marginTop:"7px" , fontSize:"14px"}}
                            variant="outlined" fullWidth
                        className={styles.InputField}></TextField>
                    </Box>
                    <Box className={styles.common_box_input}>
                            <label>Password</label>
                            <TextField
                                error={authDataError.password.status}
                                helperText={authDataError.password.message}
                                placeholder='Password'
                                className={styles.InputField}
                                value={authData.password}
                                name="password"
                                size='small'
                                sx={{marginTop:"7px" , fontSize:"14px"}}
                                type={showPassword ? 'text' : 'password'}
                                onChange={handleChange}
                                variant="outlined" fullWidth 
                                InputProps={{
                                    endAdornment: (
                                    <InputAdornment position="end">
                                        <span onClick={handleTogglePassword} className={styles.eyeIcon}>
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </span>
                                    </InputAdornment>
                                    ),
                                }}
                                />
                            
                        </Box>

                    <Box className={styles.forgetBtn}>
                        <Box className={styles.ResetBtn}>
                        { isShowOTP && isShowOTPMail && isShowOTPMailTime <=0 && <Button className={styles.resend_otp} onClick={resentOTP}>Resend</Button>}
                        </Box>
                        <Box className={styles.ForgetBox}>
                        { isShowForgotPassword && <Link className={styles.forget_password} href="/forgot-password">Forget Your Password</Link>}
                        </Box>
                        
                    </Box>

                    <LoadingButton 
                            disabled={loading} 
                            loading={loading} 
                            loadingPosition="center"
                            variant="contained" 
                            className={styles.loginBtn} 
                            onClick={login}
                        >Login</LoadingButton>
                </Box>
            </Box>
            <ToastContainer />
        </>
    )
}