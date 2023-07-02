import AddIcon from '@mui/icons-material/Add'
import { Button, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

import { ListData } from '../redux/listSlice'

const StyledButton = styled(Button)`
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 10px 0;
`

interface AddCardButtonProps {
    listId: ListData['id']
}

const AddCardButton: React.FC<AddCardButtonProps> = ({ listId }) => {
    return (
        <StyledButton startIcon={<AddIcon />}>
            <Typography sx={{ lineHeight: '20px' }}>Add a card</Typography>
        </StyledButton>
    )
}

export default AddCardButton
