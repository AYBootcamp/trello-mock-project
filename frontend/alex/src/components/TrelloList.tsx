import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import {
    CircularProgress,
    Divider,
    IconButton,
    Popover,
    Typography,
    useTheme,
} from '@mui/material'
import { useState } from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import styled from 'styled-components'

import { cardDataSelector, isCardCreating } from '../redux/cardSlice'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { deleteList, ListData } from '../redux/listSlice'
import {
    removeIdFromListOrder,
    selectCardOrderByListId,
} from '../redux/orderSlice'
import { HoverBackgroundColor, LIST_WIDTH } from '../theme'
import AddCardButton from './AddCardButton'
import ConfirmationDialog from './ConfirmationDialog'
import EditListTitle from './EditListTitle'
import TrelloCard from './TrelloCard'

const StyledList = styled(`div`)<{
    isEditing?: boolean
    backgroundColor: string
}>((props) => ({
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
    '& > :first-child :hover': {
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

const CardDnDWrapper = styled('div')``

interface TrelloListProps {
    listData: ListData
    index: number
}

const TrelloList: React.FC<TrelloListProps> = ({ listData, index }) => {
    const theme = useTheme()
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
    const { title, id } = listData
    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

    const cards = useAppSelector(cardDataSelector)
    const cardOrder = useAppSelector(selectCardOrderByListId(id))
    const isCreating = useAppSelector(isCardCreating(id))
    const dispatch = useAppDispatch()

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const renderCards = () => {
        return (
            <Droppable droppableId={id} type="row">
                {(dropProvided, dropSnapshot) => (
                    <CardDnDWrapper {...dropProvided.droppableProps}>
                        <div ref={dropProvided.innerRef}>
                            {cardOrder?.orderedCardIds.map((cardId, index) => {
                                const card = cards[cardId]
                                return (
                                    <Draggable
                                        key={card.id}
                                        draggableId={card.id}
                                        index={index}
                                    >
                                        {(dragProvided, dragSnapshot) => (
                                            <TrelloCard
                                                data={card}
                                                dragProvided={dragProvided}
                                            />
                                        )}
                                    </Draggable>
                                )
                            })}
                            {dropProvided.placeholder}
                        </div>
                    </CardDnDWrapper>
                )}
            </Droppable>
        )
    }

    const handleDelete = (id: ListData['id']) => {
        dispatch(removeIdFromListOrder(id))
        dispatch(deleteList(id))
    }

    const open = Boolean(anchorEl)
    return (
        <Draggable draggableId={id} index={index}>
            {(provided) => (
                <StyledList
                    backgroundColor={theme.palette.background.paper}
                    isEditing={isEditingTitle}
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                >
                    <ListTitleWrapper {...provided.dragHandleProps}>
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

                        <IconButton size="small" onClick={handleClick}>
                            <MoreHorizIcon />
                        </IconButton>
                        <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                        >
                            <IconButton
                                size="small"
                                onClick={() => {
                                    setConfirmDialogOpen(true)
                                }}
                            >
                                <DeleteForeverIcon />
                            </IconButton>
                        </Popover>
                        <ConfirmationDialog
                            open={confirmDialogOpen}
                            title={'Delete list'}
                            desc={`You will be deleting list '${listData.title}' forever.`}
                            handleClose={() => {
                                setConfirmDialogOpen(false)
                            }}
                            handleConfirm={() => handleDelete(id)}
                        />
                    </ListTitleWrapper>
                    <Divider />
                    <CardWrapper>
                        {renderCards()}
                        {isCreating && <CircularProgress />}
                        <AddCardButton listId={id} />
                    </CardWrapper>
                </StyledList>
            )}
        </Draggable>
    )
}

export default TrelloList
