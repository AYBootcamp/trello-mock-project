import { CircularProgress } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useCallback } from 'react'

import { useAppSelector } from '../redux/hooks'
import { isListLoading } from '../redux/listSlice'
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

const TrelloBoard = () => {
    const isLoading = useAppSelector(isListLoading)
    const listData = useAppSelector((state) => state.list.data)

    const renderLists = useCallback(() => {
        return Object.keys(listData).map((listId) => (
            <TrelloList key={listId} listData={listData[listId]} />
        ))
    }, [listData])

    if (isLoading) {
        return <CircularProgress />
    }
    return <ListContainer>{renderLists()}</ListContainer>
}

export default TrelloBoard
