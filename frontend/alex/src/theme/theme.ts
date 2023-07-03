import { createTheme } from '@mui/material'

export const LIST_WIDTH = '250px'
export const CardBackgroundColor = '#2c343a'
export const HoverBackgroundColor = '#4d5b66'

const theme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#2c343a',
            paper: '#161A1D',
        },
    },
})
export default theme
