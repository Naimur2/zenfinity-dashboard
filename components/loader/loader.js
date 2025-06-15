import React from 'react'
import { Box } from '@mui/material'

const Loader = () => {
    return (
        <Box className="my-load" id="loading">
            <Box className="loader-demo-box">
                <Box className="bar-loader">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </Box>
            </Box>
        </Box>
    )
}
export default Loader
