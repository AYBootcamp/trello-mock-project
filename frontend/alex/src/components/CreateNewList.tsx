import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import {
    Button,
    ClickAwayListener,
    IconButton,
    Input,
    styled,
} from '@mui/material'
import { useState } from 'react'

import { useAppDispatch } from '../redux/hooks'
import { createNewList } from '../redux/listSlice'

const ButtonWrapper = styled('div')`
    display: flex;
    margin: 5px 0;
`

const CreateNewList = () => {
    const dispatch = useAppDispatch()
    const [createMode, setCreateMode] = useState(false)
    const [title, setTitle] = useState('')

    const cancelCreate = () => {
        setCreateMode(false)
        setTitle('')
    }

    const onSubmit = () => {
        dispatch(createNewList(title))
    }
    if (createMode) {
        return (
            <ClickAwayListener onClickAway={cancelCreate}>
                <div>
                    <Input
                        autoFocus
                        placeholder="Enter list title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        sx={{ padding: '5px', width: '100%' }}
                    />

                    <ButtonWrapper sx={{ width: '100%' }}>
                        <Button variant="contained" onClick={() => onSubmit()}>
                            Add List
                        </Button>
                        <IconButton
                            onClick={cancelCreate}
                            sx={{ marginLeft: 'auto' }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </ButtonWrapper>
                </div>
            </ClickAwayListener>
        )
    }

    return (
        <Button
            startIcon={<AddIcon />}
            onClick={() => setCreateMode(true)}
            sx={{ width: '100%', display: 'flex', justifyContent: 'start' }}
        >
            Add new list
        </Button>
    )
}

export default CreateNewList
