import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import { groupBy, keyBy } from 'lodash'

import { apiKey } from '../secrets'
import { ListData } from './listSlice'
import { RootState } from './store'

export interface CardData {
    boardId: string
    id: string
    listId: ListData['id']
    title: string
}

export interface CardState {
    isLoading: boolean
    isCreating: boolean
    data: Record<CardData['id'], CardData>
    dataByListId: Record<ListData['id'], CardData[]>
}

const initialState: CardState = {
    isLoading: false,
    isCreating: false,
    data: {},
    dataByListId: {},
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
                dataByListId: groupBy(payload.data, 'listId') as Record<
                    ListData['id'],
                    CardData[]
                >,
            }
        })
        builder.addCase(fetchCardByBoardId.rejected, (state, action) => {
            console.log('failed', { action })
        })
        builder.addCase(createCard.pending, (state) => {
            return {
                ...state,
                isCreating: true,
            }
        })
        builder.addCase(createCard.fulfilled, (state, { payload }) => {
            const { data }: { data: CardData } = payload

            const newDataByListId = state.dataByListId[data.listId]
                ? [...state.dataByListId[data.listId]]
                : []

            newDataByListId.push(data)
            return {
                ...state,
                isCreating: false,
                data: {
                    ...state.data,
                    [data.id]: {
                        ...data,
                    },
                },
                dataByListId: {
                    ...state.dataByListId,
                    [data.listId]: newDataByListId,
                },
            }
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

// Selectors
const cardSelector = (state: RootState) => state.card

export const isCardLoading = createSelector(
    cardSelector,
    (state) => state.isLoading
)

export const isCardCreating = createSelector(
    cardSelector,
    (state) => state.isCreating
)

export const selectCardsByListId = (listId: ListData['id']) =>
    createSelector(cardSelector, (state) => state.dataByListId[listId] || [])

// Action creators are generated for each case reducer function
// export const {} = cardSlice.actions

export default cardSlice.reducer
