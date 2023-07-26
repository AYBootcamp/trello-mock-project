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

import { updateSnackbar } from '../redux/appSlice'
import { useAppDispatch } from '../redux/hooks'
import { createNewList, ListData } from '../redux/listSlice'
import { addTempCardOrder, appendListOrder } from '../redux/orderSlice'

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

    const onCreate = () => {
        onSubmit()
    }
    const onSubmit = async () => {
        const res = await dispatch(createNewList(title))
        dispatch(
            updateSnackbar({
                open: true,
                severity: 'success',
                message: `New list '${title}' created successfully`,
            })
        )
        dispatch(appendListOrder(res.payload.data.id))
        dispatch(addTempCardOrder({ listId: res.payload.data.id }))
    }
    if (createMode) {
        return (
            <ClickAwayListener onClickAway={cancelCreate}>
                <div>
                    <Input
                        data-test="new-list-title-input"
                        autoFocus
                        placeholder="Enter list title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        sx={{ padding: '5px', width: '100%' }}
                    />

                    <ButtonWrapper sx={{ width: '100%' }}>
                        <Button
                            data-test="confirm-create-new-list-btn"
                            variant="contained"
                            onClick={onCreate}
                        >
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
            data-test="add-new-list-btn"
            startIcon={<AddIcon />}
            onClick={() => setCreateMode(true)}
            sx={{ width: '100%', display: 'flex', justifyContent: 'start' }}
        >
            Add new list
        </Button>
    )
}

export default CreateNewList
