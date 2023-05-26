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
import { v4 as uuidv4 } from 'uuid'

import CardDetails from '../components/cardDetails'
import { newCard, renameList, setNewCard, updateList } from '../redux/listSlice'

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
    const [open, setOpen] = useState(false)
    const [inputValue, setInputValue] = useState('')

    const handleClickOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)
    const inputSubmit = () => {
        setOpen(false)
        dispatch(renameList([inputValue, index]))
    }

    const addNewCard = () => {
        const uniqueId = uuidv4()
        const newBox = {
            id: uniqueId,
            sequence: listBox[index].card.length + 1,
        }
        dispatch(setNewCard([newBox, index]))
        dispatch(newCard({ id: uniqueId }))
    }
    const deleteList = () => {
        let deletedLists = listBox.filter((i) => i.id !== list.id)
        dispatch(updateList(deletedLists))
    }
    return (
        <div>
            <div style={{ display: 'flex' }}>
                <Button variant="outlined" onClick={handleClickOpen}>
                    {list.name ? (
                        <div>{list.name}</div>
                    ) : (
                        <div>List {index + 1}</div>
                    )}
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
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={inputSubmit}>Confirm</Button>
                    </DialogActions>
                </Dialog>
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
