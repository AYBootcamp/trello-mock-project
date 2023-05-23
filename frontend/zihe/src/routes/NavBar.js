import React from 'react'
import { Link, Outlet } from 'react-router-dom'

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
