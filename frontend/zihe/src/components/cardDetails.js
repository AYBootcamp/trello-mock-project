import RemoveIcon from '@mui/icons-material/Remove'
import { Button } from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { deleteCard } from '../redux/listSlice'

export default function cardDetails({ card, index }) {
    const dispatch = useDispatch()
    const deleteACard = () => {
        dispatch(deleteCard(card.id))
    }
    return (
        <div>
            <div style={{ display: 'flex' }}>
                {card.name ? (
                    <div>{card.name}</div>
                ) : (
                    <div>Card {index + 1}</div>
                )}
                <Button onClick={deleteACard}>
                    <RemoveIcon />
                </Button>
            </div>
        </div>
    )
}
