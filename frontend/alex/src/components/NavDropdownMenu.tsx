import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Button, Menu, MenuItem } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useState } from 'react'

const StyledButton = styled(Button)`
    margin: 0 10px;
    padding: 10px;
    &:hover {
        background-color: #a6c5e229;
    }
`

interface NavDropdownMenuProps {
    buttonText: string
}

const NavDropdownMenu: React.FC<NavDropdownMenuProps> = ({ buttonText }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }
    return (
        <div>
            <StyledButton
                disabled
                endIcon={<ExpandMoreIcon />}
                onClick={handleClick}
            >
                {buttonText}
            </StyledButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem>some item</MenuItem>
            </Menu>
        </div>
    )
}

export default NavDropdownMenu
