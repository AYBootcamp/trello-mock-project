import { createSlice } from '@reduxjs/toolkit'

export const listSlice = createSlice({
    name: 'list',
    initialState: {
        listBox: [],
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
        updateList: (state, action) => {
            state.listBox = action.payload
        },
        deleteCard: (state, action) => {
            state.listBox = state.listBox.map((list) => {
                list.card = list.card.filter((i) => i.id !== action.payload)
            })
        },
    },
})
export const { setNewBox, setNewCard, updateList, deleteCard } =
    listSlice.actions
export default listSlice.reducer
