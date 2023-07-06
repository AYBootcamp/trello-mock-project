import React from 'react'
import { Outlet } from 'react-router-dom'

import Navigation from '../components/navigation'

export default function NavBar() {
    return (
        <div>
            <Navigation />
            <div>
                <Outlet />
            </div>
        </div>
    )
}
