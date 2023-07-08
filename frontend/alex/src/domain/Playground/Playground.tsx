import { styled } from '@mui/material/styles'
import { Link, Outlet } from 'react-router-dom'

const StyledUl = styled('ul')``

const NavigationLink = styled(Link)`
    list-style: none;
    color: white;
    font-size: large;
    font-weight: bold;
    text-decoration: underline;
    margin: 0 10px;
`

const Playground = () => {
    return (
        <div>
            <StyledUl>
                <NavigationLink to="">Playground</NavigationLink>
                <NavigationLink to="requests">Requests</NavigationLink>
                <NavigationLink to="drag-and-drop">
                    Drag and Drop
                </NavigationLink>
            </StyledUl>
            <h1>Playground</h1>
            <Outlet />
        </div>
    )
}

export default Playground
