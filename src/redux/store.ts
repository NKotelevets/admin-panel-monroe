import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
  reducer: {},
  devTools: false,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([]),
})

export type TRootState = ReturnType<typeof store.getState>
export type TAppDispatch = typeof store.dispatch

export default store

