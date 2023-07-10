import { Backdrop, CircularProgress, useTheme } from '@mui/material'
import { useCallback } from 'react'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import { useAppDispatch, useAppSelector } from '../redux/hooks'
import {
    isListCreating as isCreatingSelector,
    isListLoading,
} from '../redux/listSlice'
import { listOrderSelector, updateListOrder } from '../redux/orderSlice'
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

const StyledList = styled(`div`)<{ backgroundColor: string }>((props) => ({
    margin: '10px',
    padding: '10px',
    border: `1px solid ${props.backgroundColor}`,
    backgroundColor: `${props.backgroundColor}`,
    width: LIST_WIDTH,
    minWidth: LIST_WIDTH,
    borderRadius: `10px`,
    color: '#c3ccd5 !important',
    height: '100%',
    overflow: 'hidden',
}))

const InnerScrollContainer = styled('div')`
    overflow-y: hidden;
    overflow-x: auto;
    height: calc(100vh - 50px);
`

interface TrelloBoardProps {
    detailView?: 'card'
}

const TrelloBoard: React.FC<TrelloBoardProps> = ({ detailView }) => {
    const { cardId } = useParams()
    const theme = useTheme()
    const dispatch = useAppDispatch()
    const isLoading = useAppSelector(isListLoading)
    const isCreating = useAppSelector(isCreatingSelector)
    const listData = useAppSelector((state) => state.list.data)
    const listOrder = useAppSelector(listOrderSelector)
    const listOrderId = useAppSelector((state) => state.order.listOrderId)

    const handleDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result
        if (!destination) {
            return
        }
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return
        }
        const newListOrder = Array.from(listOrder)
        newListOrder.splice(result.source.index, 1)
        newListOrder.splice(destination.index, 0, draggableId)

        dispatch(
            updateListOrder({ id: listOrderId, orderedListIds: newListOrder })
        )
    }

    const renderCreateNewList = useCallback(() => {
        if (isCreating) {
            return <CircularProgress />
        }
        return (
            <StyledList backgroundColor={theme.palette.background.paper}>
                <CreateNewList />
            </StyledList>
        )
    }, [isCreating, theme.palette.background.paper])

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
        <InnerScrollContainer>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable
                    droppableId="list"
                    type="column"
                    direction="horizontal"
                >
                    {(provided) => (
                        <ListContainer
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {listOrder.map((listId, index) => (
                                <TrelloList
                                    key={listId}
                                    listData={listData[listId]}
                                    index={index}
                                />
                            ))}
                            {provided.placeholder}
                            {renderCreateNewList()}
                        </ListContainer>
                    )}
                </Droppable>
            </DragDropContext>

            {detailView && renderDetailViewComponent()}
        </InnerScrollContainer>
    )
}

export default TrelloBoard
