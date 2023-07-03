import EditIcon from '@mui/icons-material/Edit'
import { Divider, IconButton, Paper, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useState } from 'react'

import { CardData } from '../redux/cardSlice'
import { CardBackgroundColor, HoverBackgroundColor } from '../theme'

const StyledCard = styled(Paper)(({ theme }) => ({
    backgroundColor: CardBackgroundColor,
    borderRadius: '10px',
    margin: '10px 0',
    overflow: 'hidden',
    '& :hover': {
        cursor: 'pointer',
        backgroundColor: HoverBackgroundColor,
    },
}))

const TitleWrapper = styled('div')`
    display: flex;
    align-items: center;
`

interface TrelloCardProps {
    data: CardData
}

const TrelloCard: React.FC<TrelloCardProps> = ({ data }) => {
    const [isHover, setIsHover] = useState(false)

    return (
        <StyledCard
            onMouseEnter={() => {
                setIsHover(true)
            }}
            onMouseLeave={() => {
                setIsHover(false)
            }}
        >
            <TitleWrapper>
                <Typography sx={{ margin: '10px', width: '150px' }}>
                    {data.title}
                </Typography>
                {isHover && (
                    <EditIcon
                        fontSize="small"
                        sx={{
                            marginLeft: 'auto',
                            marginRight: '10px',
                        }}
                    />
                )}
            </TitleWrapper>

            {/* <Divider />
            other stuff */}
        </StyledCard>
    )
}

export default TrelloCard
