import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import { keyBy } from 'lodash'

import { apiKey } from '../secrets'
import { RootState } from './store'

export interface ListData {
    boardId: string
    id: string
    title: string
}

export interface ListState {
    isLoading: boolean
    isUpdating: ListData['id'] | null
    data: Record<ListData['id'], ListData>
}

const initialState: ListState = {
    isLoading: true,
    isUpdating: null,
    data: {},
}

export const listSlice = createSlice({
    name: 'list',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchListByBoardId.pending, (state, action) => {
            state.isLoading = true
        })
        builder.addCase(fetchListByBoardId.fulfilled, (state, { payload }) => {
            return {
                ...state,
                isLoading: false,
                data: keyBy(payload.data, 'id') as Record<
                    ListData['id'],
                    ListData
                >,
            }
        })
        builder.addCase(fetchListByBoardId.rejected, (state, action) => {
            console.log('failed', { action })
        })
        builder.addCase(updateList.pending, (state, action) => {
            state.isUpdating = action.meta.arg.listId
        })
        builder.addCase(updateList.fulfilled, (state, action) => {
            const listId = action.meta.arg.listId
            const originalList = state.data[listId]
            const updatedList: ListData = {
                ...originalList,
                title: action.meta.arg.title,
            }

            return {
                ...state,
                isUpdating: null,
                data: {
                    ...state.data,
                    [listId]: updatedList,
                },
            }
        })
        builder.addCase(deleteList.pending, (state, action) => {
            state.isLoading = true
        })
        builder.addCase(deleteList.rejected, (state) => {
            state.isLoading = false
        })
        builder.addCase(deleteList.fulfilled, (state, action) => {
            state.isLoading = false
            const listId = action.meta.arg
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete state.data[listId]
        })
    },
})

// AsyncThunks
export const fetchListByBoardId = createAsyncThunk(
    'list/fetchListByBoardId',
    async (boardId: string, thunkApi) => {
        const getListParams = new URLSearchParams({
            boardId,
        })
        const response = await fetch(
            `https://2qgj2kp27f.execute-api.ca-central-1.amazonaws.com/prod/getLists?${getListParams.toString()}`,
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

export const updateList = createAsyncThunk(
    'list/updateList',
    async (
        { title, listId }: { title: ListData['title']; listId: ListData['id'] },
        thunkApi
    ) => {
        const updateListParams = new URLSearchParams({
            id: listId,
        })
        const updateListData = { title }
        const response = await fetch(
            `https://2qgj2kp27f.execute-api.ca-central-1.amazonaws.com/prod/updateList?${updateListParams.toString()}`,
            {
                method: 'PUT',
                headers: {
                    'X-API-KEY': apiKey,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateListData),
            }
        )
        if (response.status !== 202) {
            return thunkApi.rejectWithValue(await response.json())
        }
        return await response.json()
    }
)

export const deleteList = createAsyncThunk(
    'list/deleteList',
    async (listId: ListData['id'], thunkApi) => {
        const deleteListParams = new URLSearchParams({
            id: listId,
        })

        const response = await fetch(
            `https://2qgj2kp27f.execute-api.ca-central-1.amazonaws.com/prod/deleteList?${deleteListParams.toString()}`,
            {
                method: 'DELETE',
                headers: {
                    'X-API-KEY': apiKey,
                },
            }
        )
        if (response.status !== 202) {
            return thunkApi.rejectWithValue(await response.json())
        }
        return await response.json()
    }
)

// Selectors
export const isListLoading = createSelector(
    (state: RootState) => state.list,
    (state) => state.isLoading
)

export const isListUpdating = (listId: ListData['id']) =>
    createSelector(
        (state: RootState) => state.list,
        (state) => state.isUpdating === listId
    )

// Action creators are generated for each case reducer function
// export const {} = listSlice.actions

export default listSlice.reducer
