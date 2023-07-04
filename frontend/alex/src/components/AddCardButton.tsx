import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import {
    Button,
    ClickAwayListener,
    Divider,
    IconButton,
    TextField,
    Typography,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { useRef, useState } from 'react'

import { createCard as createCardRequest } from '../redux/cardSlice'
import { useAppDispatch } from '../redux/hooks'
import { ListData } from '../redux/listSlice'
import { ALEX_BOARD_ID } from '../secrets'

const Wrapper = styled('div')`
    margin: 10px 0;
`

const StyledButton = styled(Button)`
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
`

const AddCardButtonWrapper = styled('div')`
    display: flex;
    align-items: center;
    margin-top: 5px;
    > :last-child {
        margin-left: auto;
    }
`

interface AddCardButtonProps {
    listId: ListData['id']
}

const AddCardButton: React.FC<AddCardButtonProps> = ({ listId }) => {
    const [title, setTitle] = useState('')
    const [createMode, setCreateMode] = useState(false)
    const titleInputRef = useRef<HTMLInputElement>(null)
    const dispatch = useAppDispatch()

    const toggleCreateMode = (mode: boolean) => {
        setCreateMode(mode)
    }

    const createCard = () => {
        if (title !== '') {
            dispatch(
                createCardRequest({
                    boardId: ALEX_BOARD_ID,
                    listId,
                    title,
                })
            )
            toggleCreateMode(false)
            setTitle('')
        } else {
            // focus on title input
            titleInputRef.current?.focus()
        }
    }

    const renderContent = () => {
        if (createMode) {
            return (
                <div>
                    <TextField
                        autoFocus
                        inputRef={titleInputRef}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        sx={{ marginBottom: '10px' }}
                    />
                    <Divider />
                    <AddCardButtonWrapper>
                        <Button
                            size="small"
                            variant="contained"
                            sx={{ height: '100%' }}
                            onClick={() => createCard()}
                        >
                            Add Card
                        </Button>
                        <IconButton
                            onClick={() => {
                                toggleCreateMode(false)
                                setTitle('')
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </AddCardButtonWrapper>
                </div>
            )
        }

        return (
            <StyledButton
                startIcon={<AddIcon />}
                onClick={() => toggleCreateMode(true)}
            >
                <Typography sx={{ lineHeight: '20px' }}>Add a card</Typography>
            </StyledButton>
        )
    }

    return (
        <ClickAwayListener
            onClickAway={() => {
                toggleCreateMode(false)
            }}
        >
            <Wrapper>{renderContent()}</Wrapper>
        </ClickAwayListener>
    )
}

export default AddCardButton
