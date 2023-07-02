import { css, Global } from '@emotion/react'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import PageLayout from './components/PageLayout'
import BoardView from './domain/BoardView'
import Playground from './domain/Playground'
import { store } from './redux/store'
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
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    <BrowserRouter>
                        <CssBaseline />
                        <PageLayout>
                            <Routes>
                                <Route index element={<BoardView />} />
                                <Route
                                    path="playground"
                                    element={<Playground />}
                                />
                            </Routes>
                        </PageLayout>
                    </BrowserRouter>
                </ThemeProvider>
            </Provider>
        </>
    )
}

export default App
