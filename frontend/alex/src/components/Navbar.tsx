import { Button, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Link, useLocation } from 'react-router-dom'

import { useAppSelector } from '../redux/hooks'
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

// interface NavbarProps {}

const Navbar: React.FC = () => {
    const location = useLocation()
    const xOffset = useAppSelector((state) => state.app.pageXOffset)
    const navMenus = ['Workspace', 'Recent', 'Starred', 'Templates']

    const isPlayground = location.pathname.includes('/playground')

    return (
        <NavContainer style={{ width: `calc(100% + ${xOffset}px` }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                Trello
            </Typography>
            {navMenus.map((menu) => (
                <NavDropdownMenu key={menu} buttonText={menu} />
            ))}

            <EndMenuContainer>
                <Button>
                    {isPlayground ? (
                        <StyledLink to="/">Home</StyledLink>
                    ) : (
                        <StyledLink to="/playground">Playground</StyledLink>
                    )}
                </Button>
            </EndMenuContainer>
        </NavContainer>
    )
}

export default Navbar
