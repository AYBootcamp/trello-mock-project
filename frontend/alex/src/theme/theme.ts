import { createTheme } from '@mui/material'

export const LIST_WIDTH = '250px'
export const CardBackgroundColor = '#2c343a'
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
