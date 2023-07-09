import {
    createAsyncThunk,
    createSelector,
    createSlice,
    PayloadAction,
} from '@reduxjs/toolkit'

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
    listOrderId: ListOrderData['id']
    listOrder: ListOrderData['orderedListIds']
}

const initialState: OrderState = {
    isListOrderLoading: false,
    isCardOrderLoading: null,
    cardOrder: {},
    listOrderId: '',
    listOrder: [],
}

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        appendListOrder: (state, action: PayloadAction<ListData['id']>) => {
            state.listOrder.push(action.payload)
        },
        removeIdFromListOrder: (
            state,
            action: PayloadAction<ListData['id']>
        ) => {
            state.listOrder = state.listOrder.filter(
                (id) => id !== action.payload
            )
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchListOrder.pending, (state, action) => {
            state.isListOrderLoading = true
        })
        builder.addCase(fetchListOrder.fulfilled, (state, { payload }) => {
            return {
                ...state,
                isListOrderLoading: false,
                listOrderId: payload.data[0].id,
                listOrder: payload.data[0]
                    .orderedListIds as ListOrderData['orderedListIds'],
            }
        })
        builder.addCase(fetchListOrder.rejected, (state, action) => {
            console.log('fetchListOrder failed', { action })
        })
        builder.addCase(updateListOrder.pending, (state, action) => {
            return {
                ...state,
                listOrder: action.meta.arg.orderedListIds,
            }
        })
        builder.addCase(updateListOrder.fulfilled, (state, action) => {
            // do nothing
        })
        builder.addCase(updateListOrder.rejected, (state, action) => {
            console.log('updateListOrder failed', { action })
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

export const updateListOrder = createAsyncThunk(
    'order/updateListOrder',
    async (
        {
            id,
            orderedListIds,
        }: { id: ListOrderData['id']; orderedListIds: Array<ListData['id']> },
        thunkApi
    ) => {
        const updateListOrderParams = new URLSearchParams({
            id,
        })
        const updateListOrderData = {
            orderedListIds,
        }

        const response = await fetch(
            `https://2qgj2kp27f.execute-api.ca-central-1.amazonaws.com/prod/updateListOrder?${updateListOrderParams.toString()}`,
            {
                method: 'PUT',
                headers: {
                    'X-API-KEY': apiKey,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateListOrderData),
            }
        )
        if (response.status !== 202) {
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
export const { appendListOrder, removeIdFromListOrder } = orderSlice.actions

export default orderSlice.reducer
