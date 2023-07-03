import { configureStore } from '@reduxjs/toolkit'

import cardReducer from './cardSlice'
import listReducer from './listSlice'

export const store = configureStore({
    reducer: {
        list: listReducer,
        card: cardReducer,
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch