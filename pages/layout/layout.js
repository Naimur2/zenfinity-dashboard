import React from 'react';
import Cookies from 'js-cookie';
import { Box } from '@mui/system';
import { useRouter } from 'next/router'

import Appbar from '../../components/common/appbar';
import Footer from '../../components/common/footer';

import styles from '../../styles/sidebar.module.scss';

export default function Layout(props) {
    
    const { children } = props;
    const router = useRouter();
    const token = Cookies.get('token');
    const [ isDrawerOpen, setIsDrawerOpen ] = React.useState(false);

    const unAuthenticatedPath = [
        "/login",
        "/logout"
        // "/register",
        // "/forgot-password",
        // "/verify-email/[identifire]",
        // "/reset-password/[identifire]"
    ]

    React.useEffect(() => {
        if(!token && unAuthenticatedPath.indexOf(router.pathname) === -1){
            router.push('/login');
        }
    }, [])

    const [isClient, setIsClient] = React.useState(false)
    React.useEffect(() => {
        setIsClient(true)
    }, [])
    
    return (
        <>
            {isClient?
                <>
                    { token && unAuthenticatedPath.indexOf(router.pathname) === -1 ?
                        <>
                            <Appbar isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen}/>
                            <Box className={ isDrawerOpen? styles.shrinkMainSection: styles.mainSection}>
                                {children}
                            </Box>
                            <Footer isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen}/>
                        </>:
                        <Box>
                            { unAuthenticatedPath.indexOf(router.pathname) > -1 && children }
                        </Box>
                    }
                </>: 
                null
            }
        </>
    );  
}