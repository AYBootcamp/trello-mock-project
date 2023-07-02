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
    data: Record<CardData['id'], CardData>
    dataByListId: Record<ListData['id'], CardData[]>
}

const initialState: CardState = {
    isLoading: false,
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
    },
})

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

const cardSelector = (state: RootState) => state.card

export const isCardLoading = createSelector(
    cardSelector,
    (state) => state.isLoading
)

export const selectCardsByListId = (listId: ListData['id']) =>
    createSelector(cardSelector, (state) => state.dataByListId[listId] || [])

// Action creators are generated for each case reducer function
// export const {} = cardSlice.actions

export default cardSlice.reducer
