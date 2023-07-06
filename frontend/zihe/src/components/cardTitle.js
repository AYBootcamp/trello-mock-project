import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { updateCardTitle } from '../redux/listSlice'

export default function cardTitle() {
    const dispatch = useDispatch()
    const { currentCard } = useSelector((state) => state.list)
    const currentTitle = currentCard.title
    const [isEditing, setIsEditing] = useState(false)
    const [text, setText] = useState(`${currentTitle}`)

    const handleDoubleClick = () => {
        setIsEditing(true)
    }

    const handleBlur = () => {
        setIsEditing(false)
        dispatch(updateCardTitle({ id: currentCard.id, newTitle: text }))
    }

    const handleChange = (e) => {
        setText(e.target.value)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleBlur()
        }
    }
    return (
        <div>
            {isEditing ? (
                <TextField
                    autoFocus
                    value={text}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                />
            ) : (
                <Typography onDoubleClick={handleDoubleClick}>
                    {text}
                </Typography>
            )}
        </div>
    )
}
