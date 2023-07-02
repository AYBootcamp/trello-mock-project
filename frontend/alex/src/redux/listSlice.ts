import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { apiKey } from '../secrets'

export interface ListState {
    value: number
}

const initialState: ListState = {
    value: 0,
}

export const listSlice = createSlice({
    name: 'list',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchListByBoardId.fulfilled, (state, { payload }) => {
            console.log({ payload })
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

// Action creators are generated for each case reducer function
// export const {} = listSlice.actions

export default listSlice.reducer
