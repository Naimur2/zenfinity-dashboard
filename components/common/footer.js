import React from 'react';
import { Box, Typography } from "@mui/material";

import styles from "../../styles/sidebar.module.scss";

export default function Footer() {
	return (
		<Box className={styles.mainFooterWrap} sx={{marginTop: '50px'}}>
			<Box className={styles.footerWrap}>
				<Typography variant="h2">
					@ 2023 zenfinity - All Right Reserved.
				</Typography>
			</Box>
		</Box>
	);
}