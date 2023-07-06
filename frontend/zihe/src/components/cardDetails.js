import { TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { updateCard } from '../redux/listSlice'

export default function cardDetails() {
    const { currentCard } = useSelector((state) => state.list)
    const dispatch = useDispatch()
    const [descriptionIsEditing, setDescriptionIsEditing] = useState(false)
    const [description, setDescription] = useState(currentCard.description)

    const updateCardDetails = () => {
        const cardDetails = {
            description: description,
        }
        dispatch(updateCard({ id: currentCard.id, newInfo: cardDetails }))
    }

    return (
        <div>
            <div>
                <h3>Description:</h3>
                <div>
                    {currentCard.description ? (
                        descriptionIsEditing ? (
                            <TextField
                                autoFocus
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value)
                                }}
                                onBlur={() => {
                                    setDescriptionIsEditing(false),
                                        updateCardDetails()
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        setDescriptionIsEditing(false),
                                            updateCardDetails()
                                    }
                                }}
                            />
                        ) : (
                            <Typography
                                onDoubleClick={() =>
                                    setDescriptionIsEditing(true)
                                }
                            >
                                {description}
                            </Typography>
                        )
                    ) : (
                        <TextField
                            multiline
                            row={5}
                            onChange={(e) => {
                                setDescription(e.target.value)
                            }}
                            onBlur={() => updateCardDetails()}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
