import { styled, useTheme } from '@mui/material/styles'

import Navbar from './Navbar'

const FullScreenContainer = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    height: '100vh',
}))

const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const theme = useTheme()
    console.log({ theme })
    return (
        <FullScreenContainer>
            <Navbar />
            {children}
        </FullScreenContainer>
    )
}

export default PageLayout
