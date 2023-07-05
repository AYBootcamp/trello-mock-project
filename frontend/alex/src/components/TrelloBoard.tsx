import { Backdrop, CircularProgress } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useCallback } from 'react'
import { useParams } from 'react-router-dom'

import { useAppSelector } from '../redux/hooks'
import { isListLoading } from '../redux/listSlice'
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

interface TrelloBoardProps {
    detailView?: 'card'
}

const TrelloBoard: React.FC<TrelloBoardProps> = ({ detailView }) => {
    const { cardId } = useParams()
    const isLoading = useAppSelector(isListLoading)
    const listData = useAppSelector((state) => state.list.data)

    const renderLists = useCallback(() => {
        return Object.keys(listData).map((listId) => (
            <TrelloList key={listId} listData={listData[listId]} />
        ))
    }, [listData])

    const renderDetailViewComponent = () => {
        return (
            <Backdrop open>
                <TrelloCardDetailView cardId={cardId ?? ''} />
            </Backdrop>
        )
    }

    if (isLoading) {
        return <CircularProgress />
    }
    return (
        <>
            <ListContainer>{renderLists()}</ListContainer>
            {detailView && renderDetailViewComponent()}
        </>
    )
}

export default TrelloBoard
