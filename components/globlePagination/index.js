import React from 'react'
import { Box, Stack, Pagination, Typography } from '@mui/material'

const GloblePagination = (props) => {
    const { count, page, limit, handlePageChange } = props;
    return (
        <Box className="paginationBar">
            <Stack spacing={2} direction="row" justifyContent='space-between' alignItems="center">
                <Pagination count={Math.ceil(count/limit)} page={page} onChange={handlePageChange} shape="rounded" />
                <Typography component="p" ><span>{page*limit+1-limit}-{(page*limit)>count?count:(page*limit)}</span> of {count} Records</Typography>
            </Stack>
        </Box>
    )
}
export default GloblePagination;