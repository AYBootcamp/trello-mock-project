import { CircularProgress } from '@mui/material'
import { styled } from '@mui/material/styles'

import TrelloList from '../components/TrelloList'
import { useAppSelector } from '../redux/hooks'
import { isListLoading } from '../redux/listSlice'

const ListContainer = styled('div')`
    display: flex;
    margin: 10px;
`

const BoardView = () => {
    const isLoading = useAppSelector(isListLoading)
    const listData = useAppSelector((state) => state.list.data)

    const renderLists = () => {
        return Object.keys(listData).map((listId) => (
            <TrelloList key={listId} listData={listData[listId]} />
        ))
    }

    if (isLoading) {
        return <CircularProgress />
    }
    return <ListContainer>{renderLists()}</ListContainer>
}

export default BoardView
