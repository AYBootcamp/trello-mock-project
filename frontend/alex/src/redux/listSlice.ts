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
    data: Record<ListData['id'], ListData>
}

const initialState: ListState = {
    isLoading: false,
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
    },
})

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

export const isListLoading = createSelector(
    (state: RootState) => state.list,
    (state) => state.isLoading
)

// Action creators are generated for each case reducer function
// export const {} = listSlice.actions

export default listSlice.reducer
