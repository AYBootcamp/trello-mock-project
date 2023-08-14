import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import { keyBy } from 'lodash'

import { apiKey } from '../secrets'
import { ListData } from './listSlice'
import { RootState } from './store'

export interface CardData {
    boardId: string
    id: string
    listId: ListData['id']
    title: string
    description?: string
}

type UpdateCardData = Omit<
    {
        [K in keyof CardData]?: CardData[K]
    },
    'id' | 'boardId'
>

export interface CardState {
    isLoading: boolean
    isCreating: ListData['id'] | null
    data: Record<CardData['id'], CardData>
}

const initialState: CardState = {
    isLoading: true,
    isCreating: null,
    data: {},
}

export const cardSlice = createSlice({
    name: 'card',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchCardByBoardId.pending, (state, action) => {
            state.isLoading = true
        })
        builder.addCase(fetchCardByBoardId.fulfilled, (state, { payload }) => {
            return {
                ...state,
                isLoading: false,
                data: keyBy(payload.data, 'id') as Record<
                    CardData['id'],
                    CardData
                >,
            }
        })
        builder.addCase(fetchCardByBoardId.rejected, (state, action) => {
            console.error('fetchCardByBoardId failed', { action })
        })
        builder.addCase(createCard.pending, (state, action) => {
            return {
                ...state,
                isCreating: action.meta.arg.listId,
            }
        })
        builder.addCase(createCard.fulfilled, (state, { payload }) => {
            const { data }: { data: CardData } = payload

            return {
                ...state,
                isCreating: null,
                data: {
                    ...state.data,
                    [data.id]: {
                        ...data,
                    },
                },
            }
        })
        builder.addCase(updateCard.pending, (state, action) => {
            const { id, updatedCard } = action.meta.arg
            return {
                ...state,
                data: {
                    ...state.data,
                    [id]: {
                        ...state.data[id],
                        ...updatedCard,
                    },
                },
            }
        })
        builder.addCase(updateCard.rejected, (state, action) => {
            console.error('updateCard failed', { action })
        })
    },
})

// AsyncThunks
export const fetchCardByBoardId = createAsyncThunk(
    'card/fetchCardByBoardId',
    async (boardId: string, thunkApi) => {
        const getCardParams = new URLSearchParams({
            boardId,
        })
        const response = await fetch(
            `https://2qgj2kp27f.execute-api.ca-central-1.amazonaws.com/prod/getCards?${getCardParams.toString()}`,
            {
                method: 'GET',
                headers: {
                    'X-API-KEY': apiKey,
                },
            }
        )
        if (response.status !== 201) {
            return thunkApi.rejectWithValue(await response.json())
        }
        return await response.json()
    }
)

export const createCard = createAsyncThunk(
    'card/createCard',
    async (
        {
            listId,
            boardId,
            title,
        }: {
            listId: ListData['id']
            boardId: string
            title: string
        },
        thunkApi
    ) => {
        const createCardData = {
            title,
            listId,
            boardId,
        }

        const response = await fetch(
            'https://2qgj2kp27f.execute-api.ca-central-1.amazonaws.com/prod/createCard',
            {
                method: 'POST',
                headers: {
                    'X-API-KEY': apiKey,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(createCardData),
            }
        )

        if (response.status !== 201) {
            return thunkApi.rejectWithValue(await response.json())
        }
        return await response.json()
    }
)

export const updateCard = createAsyncThunk(
    'card/updateCard',
    async (
        {
            id,
            updatedCard,
        }: {
            id: CardData['id']
            updatedCard: UpdateCardData
        },
        thunkApi
    ) => {
        const updateCardParams = new URLSearchParams({
            id,
        })
        const response = await fetch(
            `https://2qgj2kp27f.execute-api.ca-central-1.amazonaws.com/prod/updateCard?${updateCardParams.toString()}`,
            {
                method: 'PUT',
                headers: {
                    'X-API-KEY': apiKey,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedCard),
            }
        )
        if (response.status !== 202) {
            return thunkApi.rejectWithValue(await response.json())
        }

        return await response.json()
    }
)

// Selectors
const cardSelector = (state: RootState) => state.card

export const isCardLoading = createSelector(
    cardSelector,
    (state) => state.isLoading
)

export const isCardCreating = (listId: ListData['id']) =>
    createSelector(cardSelector, (state) => state.isCreating === listId)

export const selectCardByCardId = (cardId: CardData['id']) =>
    createSelector(cardSelector, (state) => state.data[cardId])

export const cardDataSelector = createSelector(
    cardSelector,
    (state) => state.data
)
// Action creators are generated for each case reducer function
// export const {} = cardSlice.actions

export default cardSlice.reducer
