<<<<<<< HEAD
import { createSlice } from '@reduxjs/toolkit'
=======
import { createSlice, isAnyOf } from '@reduxjs/toolkit'
>>>>>>> 7af7c13 (add sign in page and pages for testing sign auth flow, refetch token when it's experes, configure redux, add auth and design providers)

import { authApi } from '@/redux/auth/auth.api'
import { userApi } from '@/redux/user/user.api'

import { IDetailedError } from '@/common/interfaces'

interface IAppError {
  message: string
  timestamp: number
}

interface IAppSliceState {
  error: IAppError
}

const EMPTY_ERROR: IAppError = {
  message: '',
  timestamp: 0,
}

const authSliceState: IAppSliceState = {
  error: EMPTY_ERROR,
}

export const appSlice = createSlice({
  name: 'appSlice',
  initialState: authSliceState,
  reducers: {
    cleanError: (state) => {
      state.error = EMPTY_ERROR
    },
  },
  extraReducers: (builder) =>
<<<<<<< HEAD
    builder
      .addMatcher(userApi.endpoints.getUser.matchRejected, (state, action) => {
        state.error.message = (action.payload?.data as IDetailedError).details
        state.error.timestamp = new Date().getTime()
      })
      .addMatcher(authApi.endpoints.signIn.matchRejected, (state) => {
        state.error.message = 'Invalid Email/Password'
        state.error.timestamp = new Date().getTime()
      }),
=======
    builder.addMatcher(
      isAnyOf(authApi.endpoints.signIn.matchRejected, userApi.endpoints.getUser.matchRejected),
      (state, action) => {
        state.error.message = (action.payload?.data as IDetailedError).details
        state.error.timestamp = new Date().getTime()
      },
    ),
>>>>>>> 7af7c13 (add sign in page and pages for testing sign auth flow, refetch token when it's experes, configure redux, add auth and design providers)
})

export const { cleanError } = appSlice.actions

