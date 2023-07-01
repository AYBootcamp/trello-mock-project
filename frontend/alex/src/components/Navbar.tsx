import { Button, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Link, useLocation } from 'react-router-dom'

import NavDropdownMenu from './NavDropdownMenu'

const NavContainer = styled(`div`)((props) => ({
    height: '50px',
    padding: '6px 20px',
    background: `${props.theme.palette.background.paper}`,
    color: '#9FADBC',
    display: 'flex',
    alignItems: 'center',
}))

const EndMenuContainer = styled(`div`)`
    margin-left: auto;
`

const StyledLink = styled(Link)`
    text-decoration: none;
    font-weight: bold;
    color: #9fadbc;
`

const Navbar = () => {
    const location = useLocation()
    const navMenus = ['Workspace', 'Recent', 'Starred', 'Templates']

    const BackButton = () => (
        <Button>
            <StyledLink to="/">Home</StyledLink>
        </Button>
    )

    const isPlayground = location.pathname.includes('/playground')
    return (
        <NavContainer>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                Trello
            </Typography>
            {navMenus.map((menu) => (
                <NavDropdownMenu key={menu} buttonText={menu} />
            ))}

            <EndMenuContainer>
                <Button>
                    {isPlayground ? (
                        <BackButton />
                    ) : (
                        <StyledLink to="/playground">Playground</StyledLink>
                    )}
                </Button>
            </EndMenuContainer>
        </NavContainer>
    )
}

export default Navbar
