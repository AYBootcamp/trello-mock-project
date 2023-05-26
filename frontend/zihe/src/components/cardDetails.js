import InfoIcon from '@mui/icons-material/Info'
import RemoveIcon from '@mui/icons-material/Remove'
import { Button } from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { deleteCard, setCurrentCard } from '../redux/listSlice'

export default function cardDetails({ card, index }) {
    const { cardBox } = useSelector((state) => state.list)
    const findCard = cardBox.filter((item) => item.id === card.id)[0]
    const dispatch = useDispatch()
    const deleteACard = () => {
        dispatch(deleteCard(card.id))
    }
    return (
        <div>
            <div style={{ display: 'flex', position: 'relative' }}>
                {findCard.name ? (
                    <div>{findCard.name}</div>
                ) : (
                    <div>Card {index + 1}</div>
                )}
                <Button onClick={deleteACard}>
                    <RemoveIcon color="secondary" />
                </Button>
                <Button
                    style={{ position: 'absolute', right: '1px' }}
                    onClick={() => dispatch(setCurrentCard(card.id))}
                >
                    <Link to={card.id}>
                        <InfoIcon color="secondary" />
                    </Link>
                </Button>
            </div>
        </div>
    )
}
