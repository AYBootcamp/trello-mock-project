import { createTheme, ThemeProvider } from '@mui/material'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { fetchAllCards, fetchAllLists } from './redux/listSlice'
import Board from './routes/Board'
import Error from './routes/Error'
import NavBar from './routes/NavBar'

const router = createBrowserRouter([
    {
        path: '/',
        element: <NavBar />,
        children: [{ path: '', element: <Board />, errorElement: <Error /> }],
    },
    //{ path: '/:cardId', element: <Card />, errorElement: <Error /> },
])

export default function App() {
    const dispatch = useDispatch()
    const status = useSelector((state) => state.list.status)
    const theme = createTheme({
        palatte: {},
        components: {
            MuiSvgIcon: {
                styleOverrides: {
                    root: {
                        color: '#606060',
                    },
                },
            },
        },
    })
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchAllLists())
            dispatch(fetchAllCards())
        }
    }, [status, dispatch])
    let content
    if (status === 'loading') {
        content = <div>Loading</div>
    } else if (status === 'succeeded') {
        content = (
            <ThemeProvider theme={theme}>
                <RouterProvider router={router} />
            </ThemeProvider>
        )
    } else if (status === 'failed') {
        content = <div>Error</div>
    }
    return <div>{content}</div>
}
