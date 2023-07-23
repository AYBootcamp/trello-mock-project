import {
    createAsyncThunk,
    createSelector,
    createSlice,
    PayloadAction,
} from '@reduxjs/toolkit'
import { keyBy } from 'lodash'

import { ALEX_BOARD_ID, apiKey } from '../secrets'
import { CardData } from './cardSlice'
import { ListData } from './listSlice'
import { RootState } from './store'

export interface ListOrderData {
    id: string
    orderedListIds: Array<ListData['id']>
}

export interface CardOrderData {
    id?: string
    boardId: string
    listId: ListData['id']
    orderedCardIds: Array<CardData['id']>
}

export interface OrderState {
    isListOrderLoading: boolean
    isCardOrderLoading: boolean
    cardOrder: Record<CardOrderData['listId'], CardOrderData>
    listOrderId: ListOrderData['id']
    listOrder: ListOrderData['orderedListIds']
}

const initialState: OrderState = {
    isListOrderLoading: false,
    isCardOrderLoading: false,
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
        appendCardOrder: (
            state,
            action: PayloadAction<{
                listId: ListData['id']
                cardId: CardData['id']
            }>
        ) => {
            const { listId, cardId } = action.payload
            state.cardOrder[listId]?.orderedCardIds.push(cardId)
        },
        addTempCardOrder: (
            state,
            action: PayloadAction<{ listId: ListData['id'] }>
        ) => {
            // after list is created, add a temporary card order in the redux (gone after next page refresh)
            const { listId } = action.payload
            const tempCardOrderData: CardOrderData = {
                id: `temp-${listId}`,
                boardId: ALEX_BOARD_ID,
                listId,
                orderedCardIds: [],
            }

            state.cardOrder[listId] = tempCardOrderData
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
            console.error('fetchListOrder failed', { action })
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
            console.error('updateListOrder failed', { action })
        })

        builder.addCase(updateCardOrder.pending, (state, action) => {
            const { listId, orderedCardIds } = action.meta.arg
            return {
                ...state,
                cardOrder: {
                    ...state.cardOrder,
                    [listId]: {
                        ...state.cardOrder[listId],
                        orderedCardIds,
                    },
                },
            }
        })
        builder.addCase(updateCardOrder.fulfilled, (state, action) => {
            // do nothing
        })
        builder.addCase(updateCardOrder.rejected, (state, action) => {
            console.error('updateListOrder failed', { action })
        })
        builder.addCase(fetchCardOrder.pending, (state, action) => {
            return {
                ...state,
                isCardOrderLoading: true,
            }
        })
        builder.addCase(fetchCardOrder.fulfilled, (state, action) => {
            return {
                ...state,
                isCardOrderLoading: false,
                cardOrder: keyBy(action.payload.data, 'listId'),
            }
        })
        builder.addCase(fetchCardOrder.rejected, (state, action) => {
            console.error('fetchCardOrder failed', { action })
            return {
                ...state,
                isCardOrderLoading: false,
            }
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

export const fetchCardOrder = createAsyncThunk(
    'order/fetchCardOrder',
    async (boardId: string, thunkApi) => {
        const getCardOrderParams = new URLSearchParams({
            boardId,
        })
        const response = await fetch(
            `https://2qgj2kp27f.execute-api.ca-central-1.amazonaws.com/prod/getCardOrder?${getCardOrderParams.toString()}`,
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

export const updateCardOrder = createAsyncThunk(
    'order/updateCardOrder',
    async (
        {
            id,
            listId,
            orderedCardIds,
        }: {
            id: CardOrderData['id']
            listId: ListData['id']
            orderedCardIds: Array<CardData['id']>
        },
        thunkApi
    ) => {
        const updateCardOrderParams = new URLSearchParams({
            id: id ?? '',
        })
        const updateCardOrderData = {
            orderedCardIds,
        }

        const response = await fetch(
            `https://2qgj2kp27f.execute-api.ca-central-1.amazonaws.com/prod/updateCardOrder?${updateCardOrderParams.toString()}`,
            {
                method: 'PUT',
                headers: {
                    'X-API-KEY': apiKey,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateCardOrderData),
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

export const selectCardOrderByListId = (listId: ListData['id']) =>
    createSelector(orderSelector, (state) => state.cardOrder[listId])

export const cardOrderSelector = createSelector(
    orderSelector,
    (state) => state.cardOrder
)
// Action creators are generated for each case reducer function
export const {
    appendListOrder,
    removeIdFromListOrder,
    appendCardOrder,
    addTempCardOrder,
} = orderSlice.actions

export default orderSlice.reducer
