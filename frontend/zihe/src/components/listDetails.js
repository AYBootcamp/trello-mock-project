import DeleteIcon from '@mui/icons-material/Delete'
import { Button } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { createCard, deleteList, updateListTitle } from '../redux/listSlice'
import CardsInList from './cardsInList'

const CardBox = styled.div`
    border: 1px solid black;
    background-color: lavenderblush;
    margin: 5px;
    padding: 3px;
    border-radius: 5px;
    height: 100%;
    width: auto;
`
export default function listDetails({ list, index }) {
    const dispatch = useDispatch()
    const { allCards } = useSelector((state) => state.list)
    const [open, setOpen] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const handleClickOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)
    const inputSubmit = () => {
        dispatch(updateListTitle({ id: list.id, newTitle: inputValue }))
        setOpen(false)
    }
    const deleteOneList = () => {
        dispatch(deleteList(list.id))
    }
    const addNewCard = () => {
        dispatch(createCard(list.id))
    }
    return (
        <div>
            <div style={{ display: 'flex' }}>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleClickOpen}
                >
                    {list.title}
                </Button>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Rename</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Give a name for the list:
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            fullWidth
                            variant="standard"
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button color="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button color="secondary" onClick={inputSubmit}>
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>
                <Button>
                    <DeleteIcon onClick={deleteOneList} />
                </Button>
            </div>
            <div>
                {allCards.map((card, index) => {
                    if (card.listId === list.id)
                        return (
                            <CardBox key={card.id}>
                                <CardsInList card={card} index={index} />
                            </CardBox>
                        )
                })}
            </div>
            <button style={{ color: '#606060' }} onClick={addNewCard}>
                +Add a card
            </button>
        </div>
    )
}
