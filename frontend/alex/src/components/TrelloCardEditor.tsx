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

import { CardData, selectCardByCardId } from '../redux/cardSlice'
import { useAppSelector } from '../redux/hooks'
import theme, { CardBackgroundColor } from '../theme'

const EditorContainer = styled(Paper)<{ isSmallScreen: boolean }>((props) => ({
    backgroundColor: CardBackgroundColor,
    width: props.isSmallScreen ? '100%' : '50%',
    height: '60%',
    borderRadius: '20px',
    padding: '20px',
}))

interface TrelloCardEditorProps {
    cardId: CardData['id']
}

const TrelloCardEditor: React.FC<TrelloCardEditorProps> = ({ cardId }) => {
    const navigate = useNavigate()
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
    const { title } = useAppSelector(selectCardByCardId(cardId))

    const handleCloseEditor = () => {
        navigate('/')
    }

    return (
        <ClickAwayListener onClickAway={handleCloseEditor}>
            <EditorContainer isSmallScreen={isSmallScreen}>
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
            </EditorContainer>
        </ClickAwayListener>
    )
}

export default TrelloCardEditor
