import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import {
    IconButton,
    InputAdornment,
    TextField,
    Typography,
} from '@mui/material'
import { useState } from 'react'

import { updateSnackbar } from '../../redux/appSlice'
import { CardData, updateCard } from '../../redux/cardSlice'
import { useAppDispatch } from '../../redux/hooks'

interface CardDescriptionProps {
    cardId: CardData['id']
    description: CardData['description']
}
const CardDescription: React.FC<CardDescriptionProps> = ({
    cardId,
    description,
}) => {
    const dispatch = useAppDispatch()
    const [isEditing, setIsEditing] = useState(false)
    const [descValue, setDescValue] = useState(description)

    const handleSubmit: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.stopPropagation()
        setIsEditing(false)
        // no change
        if (descValue === description) {
            return
        }
        dispatch(
            updateCard({
                id: cardId,
                updatedCard: {
                    description: descValue,
                },
            })
        )
        dispatch(
            updateSnackbar({
                open: true,
                severity: 'success',
                message: `Description updated successfully`,
            })
        )
    }

    return (
        <div>
            <Typography variant="h6">Description</Typography>
            <TextField
                sx={{ width: '100%', paddingTop: '8px' }}
                value={descValue}
                placeholder="No description yet...click to add"
                multiline
                onChange={(e) => setDescValue(e.target.value)}
                onClick={() => {
                    setIsEditing(true)
                }}
                InputProps={{
                    ...(isEditing && {
                        endAdornment: (
                            <InputAdornment
                                position="end"
                                // position it bottom right
                                sx={{ marginTop: 'auto', marginBottom: '10px' }}
                            >
                                <IconButton onClick={handleSubmit}>
                                    <CheckCircleOutlineIcon color="success" />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }),
                }}
            />
        </div>
    )
}

export default CardDescription
