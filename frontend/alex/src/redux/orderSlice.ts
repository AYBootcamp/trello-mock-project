import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import { groupBy, keyBy } from 'lodash'

import { apiKey } from '../secrets'
import { CardData } from './cardSlice'
import { ListData } from './listSlice'
import { RootState } from './store'

export interface ListOrderData {
    id: string
    orderedListIds: Array<ListData['id']>
}

export interface CardOrderData {
    id: string
    orderedCardIds: Array<CardData['id']>
}

export interface OrderState {
    isListOrderLoading: boolean
    isCardOrderLoading: ListData['id'] | null
    cardOrder: Record<CardOrderData['id'], CardOrderData>
    listOrder: ListOrderData['orderedListIds']
}

const initialState: OrderState = {
    isListOrderLoading: false,
    isCardOrderLoading: null,
    cardOrder: {},
    listOrder: [],
}

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchListOrder.pending, (state, action) => {
            state.isListOrderLoading = true
        })
        builder.addCase(fetchListOrder.fulfilled, (state, { payload }) => {
            console.log({ payload })
            return {
                ...state,
                isListOrderLoading: false,
                listOrder: payload.data[0]
                    .orderedListIds as ListOrderData['orderedListIds'],
            }
        })
        builder.addCase(fetchListOrder.rejected, (state, action) => {
            console.log('fetchListOrder failed', { action })
        })
    },
})

// AsyncThunks
export const fetchListOrder = createAsyncThunk(
    'order/fetchListOrder',
    async (boardId: string, thunkApi) => {
        const getListOrderParams = new URLSearchParams({
            boardId,
        })
        const response = await fetch(
            `https://2qgj2kp27f.execute-api.ca-central-1.amazonaws.com/prod/getListOrder?${getListOrderParams.toString()}`,
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

// Selectors
const orderSelector = (state: RootState) => state.order

export const isListOrderLoading = createSelector(
    orderSelector,
    (state) => state.isListOrderLoading
)
export const listOrderSelector = createSelector(
    orderSelector,
    (state) => state.listOrder
)

// Action creators are generated for each case reducer function
// export const {} = cardSlice.actions

export default orderSlice.reducer
