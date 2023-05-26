import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Board from './routes/Board'
import Card from './routes/Card'
import Error from './routes/Error'
import NavBar from './routes/NavBar'

const router = createBrowserRouter([
    {
        path: '/',
        element: <NavBar />,
        children: [{ path: '', element: <Board />, errorElement: <Error /> }],
    },
    { path: '/:cardId', element: <Card />, errorElement: <Error /> },
])

function App() {
    return (
        <div>
            <RouterProvider router={router} />
        </div>
    )
}

export default App
