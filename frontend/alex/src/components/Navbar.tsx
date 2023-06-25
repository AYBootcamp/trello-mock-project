import { Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Link } from 'react-router-dom'

const NavContainer = styled(`div`)({
    height: '50px',
    padding: '6px',
    background: 'grey',
})

const Navbar = () => {
    return (
        <NavContainer>
            <Typography>Navbar</Typography>
            <Link to="/playground">Playground</Link>
        </NavContainer>
    )
}

export default Navbar
