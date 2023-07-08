import { css, Global } from '@emotion/react'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import PageLayout from './components/PageLayout'
import TrelloBoard from './components/TrelloBoard'
import Playground from './domain/Playground'
import DragAndDrop from './domain/Playground/drag-and-drop/DragAndDrop'
import RequestPlayground from './domain/Playground/requests/RequestPlayground'
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
                                <Route index element={<TrelloBoard />} />
                                <Route
                                    path="card/:cardId"
                                    element={<TrelloBoard detailView="card" />}
                                />
                                <Route
                                    path="playground"
                                    element={<Playground />}
                                >
                                    <Route
                                        path="requests"
                                        element={<RequestPlayground />}
                                    />
                                    <Route
                                        path="drag-and-drop"
                                        element={<DragAndDrop />}
                                    />
                                </Route>
                            </Routes>
                        </PageLayout>
                    </BrowserRouter>
                </ThemeProvider>
            </Provider>
        </>
    )
}

export default App
