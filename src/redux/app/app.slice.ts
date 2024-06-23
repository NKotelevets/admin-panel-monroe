import { createSlice, isAnyOf } from '@reduxjs/toolkit'

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
    builder.addMatcher(
      isAnyOf(authApi.endpoints.signIn.matchRejected, userApi.endpoints.getUser.matchRejected),
      (state, action) => {
        state.error.message = (action.payload?.data as IDetailedError).details
        state.error.timestamp = new Date().getTime()
      },
    ),
})

export const { cleanError } = appSlice.actions

