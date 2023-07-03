import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface AppState {
    windowWidth: number
    pageXOffset: number
}

const initialState: AppState = {
    windowWidth: 0,
    pageXOffset: 0,
}

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        updateWidth: (state, action: PayloadAction<number>) => {
            state.windowWidth = action.payload
        },
        updateXOffset: (state, action: PayloadAction<number>) => {
            state.pageXOffset = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { updateWidth, updateXOffset } = appSlice.actions

export default appSlice.reducer
