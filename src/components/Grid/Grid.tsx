import React, { useMemo } from 'react';

import type { SxProps } from '@mui/material';
import MuiGrid from '@mui/material/Grid';

export type GridProps = {
    children: React.ReactNode,
    sx?: SxProps
};
export const Grid = ({ children, sx }: GridProps) => {

    const { arrayChildren, responsive } = useMemo(() => {
        const l_array = React.Children.toArray(children);
        let l_responsive;
        if (l_array.length <= 2) {
            const xsHeight = (100 / l_array.length) + '%';
            const mdHeight = (100 / Math.ceil(l_array.length / 2)) + '%';
            l_responsive = { xs: 12, md: 6, sx: { height: { xs: xsHeight, md: mdHeight } } };
        } else if (l_array.length <= 4) {
            const xsHeight = (100 / l_array.length) + '%';
            const smHeight = (100 / Math.ceil(l_array.length / 2)) + '%';
            l_responsive = { xs: 12, sm: 6, sx: { height: { xs: xsHeight, sm: smHeight } } };
        } else if (l_array.length <= 6) {
            const xsHeight = (100 / Math.ceil(l_array.length / 2)) + '%';
            const mdHeight = (100 / Math.ceil(l_array.length / 3)) + '%';
            l_responsive = { xs: 6, md: 4, sx: { height: { xs: xsHeight, md: mdHeight } } };
        } else if (l_array.length <= 9) {
            const xsHeight = (100 / Math.ceil(l_array.length / 2)) + '%';
            const smHeight = (100 / Math.ceil(l_array.length / 3)) + '%';
            l_responsive = { xs: 6, sm: 4, sx: { height: { xs: xsHeight, sm: smHeight } } };
        } else if (l_array.length <= 12) {
            const xsHeight = (100 / Math.ceil(l_array.length / 3)) + '%';
            const mdHeight = (100 / Math.ceil(l_array.length / 4)) + '%';
            l_responsive = { xs: 4, md: 3, sx: { height: { xs: xsHeight, md: mdHeight } } };
        } else if (l_array.length <= 24) {
            const xsHeight = (100 / Math.ceil(l_array.length / 3)) + '%';
            const smHeight = (100 / Math.ceil(l_array.length / 6)) + '%';
            l_responsive = { xs: 4, sm: 2, sx: { height: { xs: xsHeight, sm: smHeight, } } };
        } else if (l_array.length <= 42) {
            const xsHeight = (100 / Math.ceil(l_array.length / 4)) + '%';
            const smHeight = (100 / Math.ceil(l_array.length / 6)) + '%';
            l_responsive = { xs: 3, sm: 2, sx: { height: { xs: xsHeight, sm: smHeight } } };
        } else {
            const xsHeight = (100 / Math.ceil(l_array.length / 6)) + '%';
            const lgHeight = (100 / Math.ceil(l_array.length / 12)) + '%';
            l_responsive = { xs: 2, lg: 1, sx: { height: { xs: xsHeight, lg: lgHeight } } };
        }

        return { arrayChildren: l_array, responsive: l_responsive }
    }, [children])

    return <MuiGrid container direction="row"
        sx={sx}
        justifyContent="space-around" alignItems="center">
        {React.Children.map(arrayChildren, (child, index) => {
            return <MuiGrid item key={index}
                // in order to display child in the middle of grid item, need to set display:flex AND justifyContent:center
                display='flex' justifyContent='center'
                {...responsive}>
                {child}
            </MuiGrid>
        })}
    </MuiGrid>
};