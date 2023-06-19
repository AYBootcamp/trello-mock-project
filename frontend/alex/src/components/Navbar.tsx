import { Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

const NavContainer = styled(`div`)({
    height: '50px',
    padding: '6px',
    background: 'grey',
})

const Navbar = () => {
    return (
        <NavContainer>
            <Typography>Navbar</Typography>
        </NavContainer>
    )
}

export default Navbar
