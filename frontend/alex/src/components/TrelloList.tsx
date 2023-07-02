import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { Divider, IconButton, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

import { selectCardsByListId } from '../redux/cardSlice'
import { useAppSelector } from '../redux/hooks'
import { ListData } from '../redux/listSlice'
import { LIST_WIDTH } from '../theme'
import AddCardButton from './AddCardButton'
import TrelloCard from './TrelloCard'

interface TrelloListProps {
    listData: ListData
}

const StyledList = styled(`div`)(({ theme }) => ({
    margin: '10px',
    padding: '10px',
    border: `1px solid ${theme.palette.background.paper}`,
    backgroundColor: `${theme.palette.background.paper}`,
    width: LIST_WIDTH,
    borderRadius: `10px`,
    color: '#c3ccd5 !important',
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

const TrelloList: React.FC<TrelloListProps> = ({ listData }) => {
    const { title, id } = listData
    const cards = useAppSelector(selectCardsByListId(id))

    const renderCards = () => {
        if (cards.length > 0) {
            return cards.map((card) => <TrelloCard key={card.id} data={card} />)
        }
        return <AddCardButton listId={id} />
    }

    return (
        <StyledList>
            <ListTitleWrapper>
                <Typography variant="h6" sx={{ fontSize: '1.1em' }}>
                    {title}
                </Typography>
                <IconButton size="small">
                    <MoreHorizIcon />
                </IconButton>
            </ListTitleWrapper>
            <Divider />
            <CardWrapper>{renderCards()}</CardWrapper>
        </StyledList>
    )
}

export default TrelloList
