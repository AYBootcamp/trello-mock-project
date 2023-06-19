import { css, Global } from '@emotion/react'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import PageLayout from './components/PageLayout'
import BoardView from './domain/BoardView'
import theme from './theme'

const App = () => {
    return (
        <>
            <Global
                styles={css`
                    body {
                        margin: 0;
                    }
                `}
            />
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <PageLayout>
                    <BrowserRouter>
                        <Routes>
                            <Route index element={<BoardView />} />
                        </Routes>
                    </BrowserRouter>
                </PageLayout>
            </ThemeProvider>
        </>
    )
}

export default App
