import CheckIcon from '@mui/icons-material/Check'
import {
    Box,
    CircularProgress,
    ClickAwayListener,
    Input,
    InputAdornment,
} from '@mui/material'
import { useState } from 'react'

import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { isListUpdating, ListData, updateList } from '../../redux/listSlice'

interface EditListTitleProps {
    listId: ListData['id']
    oldTitle: string
    onBlur: () => void
}

const EditListTitle: React.FC<EditListTitleProps> = ({
    listId,
    oldTitle,
    onBlur,
}) => {
    const [newTitle, setNewTitle] = useState(oldTitle)
    const dispatch = useAppDispatch()
    const isUpdating = useAppSelector(isListUpdating(listId))

    const onClick = () => {
        if (newTitle !== oldTitle) {
            onSubmit()
        }
    }

    const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            onSubmit()
        }
    }
    const onSubmit = async (e?: React.MouseEvent) => {
        e?.preventDefault()
        await dispatch(
            updateList({
                listId,
                title: newTitle,
            })
        )
        onBlur()
    }

    return (
        <ClickAwayListener onClickAway={onBlur}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {isUpdating ? (
                    <CircularProgress />
                ) : (
                    <>
                        <Input
                            size="small"
                            autoFocus
                            value={newTitle}
                            onChange={(e) => {
                                setNewTitle(e.target.value)
                            }}
                            onKeyDown={onKeyDown}
                            endAdornment={
                                <InputAdornment position="start">
                                    <CheckIcon onClick={onClick} />
                                </InputAdornment>
                            }
                        />
                    </>
                )}
            </Box>
        </ClickAwayListener>
    )
}

export default EditListTitle
