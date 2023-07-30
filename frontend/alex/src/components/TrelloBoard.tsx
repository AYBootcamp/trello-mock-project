import { Backdrop, CircularProgress, useTheme } from '@mui/material'
import { useCallback } from 'react'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import { useAppDispatch, useAppSelector } from '../redux/hooks'
import {
    isListCreating as isCreatingSelector,
    isListLoading,
    ListData,
} from '../redux/listSlice'
import {
    cardOrderSelector,
    listOrderSelector,
    updateCardOrder,
    updateListOrder,
} from '../redux/orderSlice'
import { LIST_WIDTH } from '../theme'
import TrelloCardDetailView from './TrelloCard/TrelloCardDetailView'
import CreateNewList from './TrelloList/CreateNewList'
import TrelloList from './TrelloList/TrelloList'

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
    const cardOrders = useAppSelector(cardOrderSelector)

    const handleDragEnd = (result: DropResult) => {
        const { destination, source, draggableId, type } = result
        if (!destination) {
            return
        }
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return
        }

        if (type === 'column') {
            // drag and drop Lists
            const newListOrder = Array.from(listOrder)
            newListOrder.splice(result.source.index, 1)
            newListOrder.splice(destination.index, 0, draggableId)
            dispatch(
                updateListOrder({
                    id: listOrderId,
                    orderedListIds: newListOrder,
                })
            )
        } else if (type === 'row') {
            // drag and drop Cards
            if (destination.droppableId === source.droppableId) {
                // within the same list
                const listId = destination.droppableId
                const cardOrder = cardOrders[listId]
                const newOrderedIds = Array.from(cardOrder.orderedCardIds)
                newOrderedIds.splice(result.source.index, 1)
                newOrderedIds.splice(destination.index, 0, draggableId)

                dispatch(
                    updateCardOrder({
                        id: cardOrder.id,
                        listId,
                        orderedCardIds: newOrderedIds,
                    })
                )
            } else {
                // update 2 cardOrder
                // add Card Order
                const listIdToAddCard = destination.droppableId
                const cardOrderToAddCard = cardOrders[listIdToAddCard]

                const newOrderedIdsToAddCard = Array.from(
                    cardOrderToAddCard.orderedCardIds
                )
                newOrderedIdsToAddCard.splice(destination.index, 0, draggableId)

                dispatch(
                    updateCardOrder({
                        id: cardOrderToAddCard.id,
                        listId: listIdToAddCard,
                        orderedCardIds: newOrderedIdsToAddCard,
                    })
                )

                // Remove Card Order
                const listIdToRemoveCard = source.droppableId
                const cardOrderToRemoveCard = cardOrders[listIdToRemoveCard]

                const newOrderedIdsToRemoveCard = Array.from(
                    cardOrderToRemoveCard.orderedCardIds
                )
                newOrderedIdsToRemoveCard.splice(result.source.index, 1)
                dispatch(
                    updateCardOrder({
                        id: cardOrderToRemoveCard.id,
                        listId: listIdToRemoveCard,
                        orderedCardIds: newOrderedIdsToRemoveCard,
                    })
                )
            }
        }
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
                            {listOrder.map((listId, index) => {
                                return (
                                    <TrelloList
                                        key={listId}
                                        listData={listData[listId]}
                                        index={index}
                                    />
                                )
                            })}
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
