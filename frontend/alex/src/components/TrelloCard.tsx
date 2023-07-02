import { Divider, IconButton, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

import { CardData } from '../redux/cardSlice'
import { CardBackgroundColor } from '../theme'

const StyledCard = styled('div')(({ theme }) => ({
    backgroundColor: CardBackgroundColor,
    borderRadius: '10px',
    padding: '10px',
    margin: '10px 0',
}))

interface TrelloCardProps {
    data: CardData
}

const TrelloCard: React.FC<TrelloCardProps> = ({ data }) => {
    return (
        <StyledCard>
            <Typography>{data.title}</Typography>
            {/* <Divider />
            other stuff */}
        </StyledCard>
    )
}

export default TrelloCard
