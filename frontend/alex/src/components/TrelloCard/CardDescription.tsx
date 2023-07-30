import { TextField, Typography } from '@mui/material'

import { CardData } from '../../redux/cardSlice'

interface CardDescriptionProps {
    cardId: CardData['id']
    description: CardData['description']
}
const CardDescription: React.FC<CardDescriptionProps> = ({
    cardId,
    description,
}) => {
    return (
        <div>
            <Typography variant="h6">Description</Typography>
            {description}
            <TextField multiline />
        </div>
    )
}

export default CardDescription
