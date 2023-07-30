import CloseIcon from '@mui/icons-material/Close'
import {
    ClickAwayListener,
    Grid,
    IconButton,
    Paper,
    Typography,
    useMediaQuery,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'

import { CardData, selectCardByCardId } from '../../redux/cardSlice'
import { useAppSelector } from '../../redux/hooks'
import theme, { CardBackgroundColor } from '../../theme'
import CardDescription from './CardDescription'

const DetailViewContainer = styled(Paper)<{ isSmallScreen: boolean }>(
    (props) => ({
        backgroundColor: CardBackgroundColor,
        width: props.isSmallScreen ? '100%' : '50%',
        height: '60%',
        borderRadius: '20px',
        padding: '20px',
    })
)

interface TrelloCardDetailViewProps {
    cardId: CardData['id']
}

const TrelloCardDetailView: React.FC<TrelloCardDetailViewProps> = ({
    cardId,
}) => {
    const navigate = useNavigate()
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
    const { title, description } = useAppSelector(selectCardByCardId(cardId))

    const handleCloseEditor = () => {
        navigate('/')
    }

    return (
        <ClickAwayListener onClickAway={handleCloseEditor}>
            <DetailViewContainer isSmallScreen={isSmallScreen}>
                <Grid container>
                    <Grid container>
                        <Grid item sx={{ display: 'flex', width: '100%' }}>
                            <Typography variant="h5">{title}</Typography>
                            <IconButton
                                sx={{ marginLeft: 'auto' }}
                                onClick={handleCloseEditor}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item>
                            <CardDescription
                                description={description}
                                cardId={cardId}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </DetailViewContainer>
        </ClickAwayListener>
    )
}

export default TrelloCardDetailView
