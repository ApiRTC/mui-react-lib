import React, { useMemo } from 'react'

import MuiGrid from '@mui/material/Grid'

export type GridProps = {
    children: React.ReactNode
};
const Grid = ({ children }: GridProps) => {

    const { arrayChildren, responsive } = useMemo(() => {
        const l_array = React.Children.toArray(children);
        let l_responsive;
        if (l_array.length <= 1) {
            l_responsive = { xs: 12 };
        } else if (l_array.length <= 4) {
            l_responsive = { xs: 12, sm: 6 };
        } else if (l_array.length <= 6) {
            l_responsive = { xs: 12, sm: 6, md: 6, lg: 4 };
        } else if (l_array.length <= 8) {
            l_responsive = { xs: 12, sm: 6, md: 4, lg: 3 };
        } else if (l_array.length >= 12) {
            l_responsive = { xs: 12, sm: 4, md: 3, lg: 2 };
        }

        return { arrayChildren: l_array, responsive: l_responsive }
    }, [children])

    return <MuiGrid container direction="row" justifyContent="space-around" alignItems="center">
        {React.Children.map(arrayChildren, (child, index) => {
            return <MuiGrid item key={index}
                {...responsive}
                // in order to display StreamComponent in the middle of grid item, need to set display:flex AND justifyContent:center
                sx={{ display: 'flex', justifyContent: 'center' }}>
                {child}
            </MuiGrid>
        })}
    </MuiGrid>
}
export default Grid;