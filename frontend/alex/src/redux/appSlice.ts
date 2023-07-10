import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { SnackbarState } from '../components/Snackbar'
import { RootState } from './store'

export interface AppState {
    windowWidth: number
    pageXOffset: number
    snackBarState: SnackbarState
}

export const initialSnackbarState: SnackbarState = {
    open: false,
}

const initialState: AppState = {
    windowWidth: 0,
    pageXOffset: 0,
    snackBarState: initialSnackbarState,
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
        updateSnackbar: (state, action: PayloadAction<SnackbarState>) => {
            state.snackBarState = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { updateWidth, updateXOffset, updateSnackbar } = appSlice.actions

// Selectors
const appSelector = (state: RootState) => state.app

export const snackBarStateSelector = createSelector(
    appSelector,
    (state) => state.snackBarState
)

export default appSlice.reducer
