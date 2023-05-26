import { createSlice } from '@reduxjs/toolkit'

export const listSlice = createSlice({
    name: 'list',
    initialState: {
        listBox: [],
        cardBox: [],
        currentCard: null,
    },
    reducers: {
        setNewBox: (state, action) => {
            state.listBox = [...state.listBox, action.payload]
        },
        setNewCard: (state, action) => {
            state.listBox[action.payload[1]].card = [
                ...state.listBox[action.payload[1]].card,
                action.payload[0],
            ]
        },
        renameList: (state, action) => {
            state.listBox[action.payload[1]].name = action.payload[0]
        },
        updateList: (state, action) => {
            state.listBox = action.payload
        },
        deleteCard: (state, action) => {
            state.listBox = state.listBox.map((list) => {
                return {
                    ...list,
                    card: list.card.filter((i) => i.id !== action.payload),
                }
            })
            /*             state.listBox = state.listBox.map((list) => {
                list.card = list.card.filter((i) => i.id !== action.payload)
            }) */
        },
        setCardDetails: (state, action) => {
            //[0]:card.id,[1]:newCardDetails
            state.cardBox = state.cardBox.map((i) => {
                if (i.id === action.payload[0]) {
                    return action.payload[1]
                } else {
                    return i
                }
            })
        },
        newCard: (state, action) => {
            state.cardBox = [...state.cardBox, action.payload]
        },
        setCurrentCard: (state, action) => {
            state.currentCard = action.payload
        },
    },
})
export const {
    setNewBox,
    setNewCard,
    renameList,
    updateList,
    deleteCard,
    setCardDetails,
    newCard,
    setCurrentCard,
} = listSlice.actions
export default listSlice.reducer
