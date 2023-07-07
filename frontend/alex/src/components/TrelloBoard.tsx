import { Backdrop, CircularProgress } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useCallback } from 'react'
import { useParams } from 'react-router-dom'

import { useAppSelector } from '../redux/hooks'
import {
    isListCreating as isCreatingSelector,
    isListLoading,
} from '../redux/listSlice'
import { LIST_WIDTH } from '../theme'
import CreateNewList from './CreateNewList'
import TrelloCardDetailView from './TrelloCardDetailView'
import TrelloList from './TrelloList'

const ListContainer = styled('div')`
    display: flex;
    margin: 10px 0;
    & > :first-of-type {
        margin-left: 20px;
    }
    & > :last-of-type {
        margin-right: 20px;
    }
`

const StyledList = styled(`div`)((props) => ({
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
}))

interface TrelloBoardProps {
    detailView?: 'card'
}

const TrelloBoard: React.FC<TrelloBoardProps> = ({ detailView }) => {
    const { cardId } = useParams()
    const isLoading = useAppSelector(isListLoading)
    const isCreating = useAppSelector(isCreatingSelector)
    const listData = useAppSelector((state) => state.list.data)

    const renderLists = useCallback(() => {
        return Object.keys(listData).map((listId) => (
            <TrelloList key={listId} listData={listData[listId]} />
        ))
    }, [listData])

    const renderCreateNewList = useCallback(() => {
        if (isCreating) {
            return <CircularProgress />
        }
        return (
            <StyledList>
                <CreateNewList />
            </StyledList>
        )
    }, [isCreating])

    const renderDetailViewComponent = useCallback(() => {
        return (
            <Backdrop open>
                <TrelloCardDetailView cardId={cardId ?? ''} />
            </Backdrop>
        )
    }, [cardId])

    if (isLoading) {
        return <CircularProgress />
    }
    return (
        <>
            <ListContainer>
                {renderLists()}
                {renderCreateNewList()}
            </ListContainer>
            {detailView && renderDetailViewComponent()}
        </>
    )
}

export default TrelloBoard
