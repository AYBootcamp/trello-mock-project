import { Box, CircularProgress, Input } from '@mui/material'
import { useState } from 'react'

import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { isListUpdating, ListData, updateList } from '../redux/listSlice'

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
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isUpdating ? (
                <CircularProgress />
            ) : (
                <Input
                    size="small"
                    autoFocus
                    value={newTitle}
                    onChange={(e) => {
                        setNewTitle(e.target.value)
                    }}
                    onKeyDown={onKeyDown}
                    onBlur={onBlur}
                />
            )}
        </Box>
    )
}

export default EditListTitle
