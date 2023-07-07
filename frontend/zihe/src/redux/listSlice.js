import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import {
    APIKEY,
    BoardID,
    CreateCardUrl,
    CreateListUrl,
    DeleteCardUrl,
    DeleteListUrl,
    GetCardsUrl,
    GetListOrderUrl,
    GetListsUrl,
    UpdateCardUrl,
    UpdateListUrl,
} from '../constants'

export const fetchAllLists = createAsyncThunk(
    'list/fetchAllLists',
    async () => {
        const params = new URLSearchParams({
            boardId: BoardID,
        })
        const resp = await fetch(`${GetListsUrl}?${params.toString()}`, {
            method: 'GET',
            headers: {
                'X-API-KEY': APIKEY,
            },
        })
        const data = await resp.json()
        const allData = data.data
        let updatedList = []
        const orderResp = await fetch(
            `${GetListOrderUrl}?${params.toString()}`,
            {
                method: 'GET',
                headers: {
                    'X-API-KEY': APIKEY,
                },
            }
        )
        const orderData = await orderResp.json()
        const orderedList = orderData.data
        const orderedListIds = orderedList[0].orderedListIds
        for (let i = 0; i < orderedListIds.length; i++) {
            for (let j = 0; j < allData.length; j++) {
                if (allData[j].id === orderedListIds[i]) {
                    updatedList.push(allData[j])
                    break
                }
            }
        }
        return updatedList
    }
)

export const fetchAllCards = createAsyncThunk(
    'list/fetchAllCards',
    async () => {
        const params = new URLSearchParams({
            boardId: BoardID,
        })
        const resp = await fetch(`${GetCardsUrl}?${params.toString()}`, {
            method: 'GET',
            headers: {
                'X-API-KEY': APIKEY,
            },
        })
        const data = await resp.json()
        return data.data
    }
)

export const updateListTitle = createAsyncThunk(
    'list/updateListTitle',
    async ({ id, newTitle }) => {
        const listParams = new URLSearchParams({ id: id })
        const resp = await fetch(`${UpdateListUrl}?${listParams.toString()}`, {
            method: 'PUT',
            headers: { 'X-API-KEY': APIKEY },
            body: JSON.stringify({ title: newTitle }),
        })
        return { newTitle, id }
    }
)

export const createList = createAsyncThunk('list/createList', async () => {
    const resp = await fetch(`${CreateListUrl}`, {
        method: 'POST',
        headers: { 'X-API-KEY': APIKEY },
        body: JSON.stringify({ boardId: `${BoardID}`, title: 'New List' }),
    })
    const data = await resp.json()
    return data.data
})

export const deleteList = createAsyncThunk('list/deleteList', async (id) => {
    const listParams = new URLSearchParams({ id: id })
    const resp = await fetch(`${DeleteListUrl}?${listParams.toString()}`, {
        method: 'DELETE',
        headers: { 'X-API-KEY': APIKEY },
    })
    return id
})

export const deleteCard = createAsyncThunk('list/deleteCard', async (id) => {
    const listParams = new URLSearchParams({ id: id })
    const resp = await fetch(`${DeleteCardUrl}?${listParams.toString()}`, {
        method: 'DELETE',
        headers: { 'X-API-KEY': APIKEY },
    })
    return id
})

export const createCard = createAsyncThunk(
    'list/createCard',
    async (listId) => {
        const resp = await fetch(`${CreateCardUrl}`, {
            method: 'POST',
            headers: { 'X-API-KEY': APIKEY },
            body: JSON.stringify({
                title: 'New Card',
                listId: listId,
                boardId: `${BoardID}`,
            }),
        })
        const data = await resp.json()
        return data.data
    }
)

export const updateCardTitle = createAsyncThunk(
    'list/updateCardTitle',
    async ({ id, newTitle }) => {
        const listParams = new URLSearchParams({ id: id })
        const resp = await fetch(`${UpdateCardUrl}?${listParams.toString()}`, {
            method: 'PUT',
            headers: { 'X-API-KEY': APIKEY },
            body: JSON.stringify({ title: newTitle }),
        })
        return { newTitle, id }
    }
)

export const updateCard = createAsyncThunk(
    'list/updateCard',
    async ({ id, newInfo }) => {
        const listParams = new URLSearchParams({ id: id })
        const resp = await fetch(`${UpdateCardUrl}?${listParams.toString()}`, {
            method: 'PUT',
            headers: { 'X-API-KEY': APIKEY },
            body: JSON.stringify({
                description: newInfo.description,
            }),
        })
        return { newInfo, id }
    }
)

export const listSlice = createSlice({
    name: 'list',
    initialState: {
        allLists: [],
        allCards: [],
        currentCard: {},
        status: 'idle',
        error: null,
    },
    reducers: {
        setCurrentCard: (state, action) => {
            state.currentCard = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllLists.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchAllLists.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.allLists = action.payload
            })
            .addCase(fetchAllLists.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
        builder.addCase(fetchAllCards.fulfilled, (state, action) => {
            state.allCards = action.payload
        })
        builder.addCase(updateListTitle.fulfilled, (state, action) => {
            const id = action.payload.id
            const newTitle = action.payload.newTitle
            state.allLists = state.allLists.map((item) => {
                if (item.id === id) {
                    return { ...item, title: newTitle }
                } else {
                    return item
                }
            })
        })
        builder.addCase(createList.fulfilled, (state, action) => {
            state.allLists.push(action.payload)
        })
        builder.addCase(deleteList.fulfilled, (state, action) => {
            state.allLists = state.allLists.filter(
                (item) => item.id !== action.payload
            )
        })
        builder.addCase(deleteCard.fulfilled, (state, action) => {
            state.allCards = state.allCards.filter(
                (item) => item.id !== action.payload
            )
        })
        builder.addCase(createCard.fulfilled, (state, action) => {
            state.allCards.push(action.payload)
        })
        builder.addCase(updateCardTitle.fulfilled, (state, action) => {
            const id = action.payload.id
            const newTitle = action.payload.newTitle
            state.allCards = state.allCards.map((item) => {
                if (item.id === id) {
                    return { ...item, title: newTitle }
                } else {
                    return item
                }
            })
        })
        builder.addCase(updateCard.fulfilled, (state, action) => {
            const id = action.payload.id
            const newDescription = action.payload.newInfo.description
            state.allCards = state.allCards.map((item) => {
                if (item.id === id) {
                    return {
                        ...item,
                        description: newDescription,
                    }
                } else {
                    return item
                }
            })
        })
    },
})
export const { setCurrentCard } = listSlice.actions
export default listSlice.reducer
