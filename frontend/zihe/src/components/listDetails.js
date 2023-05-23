import DeleteIcon from '@mui/icons-material/Delete'
import { Button } from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'

import CardDetails from '../components/cardDetails'
import { setNewCard, updateList } from '../redux/listSlice'

const CardBox = styled.div`
    border: 1px solid black;
    background-color: rosybrown;
    margin: 5px;
    padding: 3px;
    border-radius: 5px;
    height: 100%;
    width: auto;
`
export default function listDetails({ list, index }) {
    const dispatch = useDispatch()
    const { listBox } = useSelector((state) => state.list)
    const addNewCard = () => {
        const uniqueId = uuidv4()
        const newBox = {
            id: uniqueId,
            sequence: listBox[index].card.length + 1,
        }
        dispatch(setNewCard([newBox, index]))
    }
    const deleteList = () => {
        let deletedLists = listBox.filter((i) => i.id !== list.id)
        dispatch(updateList(deletedLists))
    }
    return (
        <div>
            <div style={{ display: 'flex' }}>
                {list.name ? (
                    <div>{list.name}</div>
                ) : (
                    <div>List {index + 1}</div>
                )}
                <Button onClick={deleteList}>
                    <DeleteIcon />
                </Button>
            </div>
            <div>
                {list.card.map((card, index) => (
                    <CardBox key={card.id}>
                        <CardDetails card={card} index={index} />
                    </CardBox>
                ))}
            </div>
            <button onClick={addNewCard}>+ Add a card</button>
        </div>
    )
}
