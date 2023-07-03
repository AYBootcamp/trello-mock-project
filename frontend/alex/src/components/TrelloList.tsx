import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import {
    CircularProgress,
    Divider,
    IconButton,
    Typography,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { useState } from 'react'

import { isCardCreating, selectCardsByListId } from '../redux/cardSlice'
import { useAppSelector } from '../redux/hooks'
import { ListData } from '../redux/listSlice'
import { HoverBackgroundColor, LIST_WIDTH } from '../theme'
import AddCardButton from './AddCardButton'
import EditListTitle from './EditListTitle'
import TrelloCard from './TrelloCard'

const StyledList = styled(`div`)<{ isEditing: boolean }>((props) => ({
    margin: '10px',
    padding: '10px',
    border: `1px solid ${props.theme.palette.background.paper}`,
    backgroundColor: `${props.theme.palette.background.paper}`,
    width: LIST_WIDTH,
    minWidth: LIST_WIDTH,
    borderRadius: `10px`,
    color: '#c3ccd5 !important',
    height: '100%',
    overflow: 'hidden',
    '& > :first-of-type :hover': {
        cursor: 'pointer',
        backgroundColor: props.isEditing ? '' : HoverBackgroundColor,
        borderRadius: '5px',
    },
}))

const ListTitleWrapper = styled('div')`
    padding-bottom: 10px;
    display: flex;
    align-items: center;
    & > button {
        margin-left: auto;
    }
`
const CardWrapper = styled('div')`
    width: 100%;
`

const TitleText = styled(Typography)`
    padding: 0 5px;
    font-size: 1.1em;
    width: 100%;
`

interface TrelloListProps {
    listData: ListData
}
const TrelloList: React.FC<TrelloListProps> = ({ listData }) => {
    const { title, id } = listData
    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const cards = useAppSelector(selectCardsByListId(id))
    const isCreating = useAppSelector(isCardCreating(id))

    const renderCards = () => {
        if (cards.length > 0) {
            return cards.map((card) => <TrelloCard key={card.id} data={card} />)
        }
        return null
    }

    return (
        <StyledList isEditing={isEditingTitle}>
            <ListTitleWrapper>
                {isEditingTitle ? (
                    <EditListTitle
                        listId={id}
                        oldTitle={title}
                        onBlur={() => setIsEditingTitle(false)}
                    />
                ) : (
                    <TitleText
                        variant="h6"
                        onClick={() => setIsEditingTitle(true)}
                    >
                        {title}
                    </TitleText>
                )}

                <IconButton size="small">
                    <MoreHorizIcon />
                </IconButton>
            </ListTitleWrapper>
            <Divider />
            <CardWrapper>
                {renderCards()}
                {isCreating && <CircularProgress />}
                <AddCardButton listId={id} />
            </CardWrapper>
        </StyledList>
    )
}

export default TrelloList
