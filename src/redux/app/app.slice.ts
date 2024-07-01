import { createSlice } from '@reduxjs/toolkit'

import { authApi } from '@/redux/auth/auth.api'
import { leaguesApi } from '@/redux/leagues/leagues.api'
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
    builder
      .addMatcher(userApi.endpoints.getUser.matchRejected, (state, action) => {
        state.error.message = (action.payload?.data as IDetailedError).details
        state.error.timestamp = new Date().getTime()
      })
      .addMatcher(authApi.endpoints.signIn.matchRejected, (state) => {
        state.error.message = 'Invalid Email/Password'
        state.error.timestamp = new Date().getTime()
      })
      .addMatcher(leaguesApi.endpoints.createLeague.matchRejected, (state, action) => {
        state.error.message = (action.payload?.data as IDetailedError).details
        state.error.timestamp = new Date().getTime()
      })
      .addMatcher(leaguesApi.endpoints.deleteLeague.matchRejected, (state, action) => {
        state.error.message = (action.payload?.data as IDetailedError).details
        state.error.timestamp = new Date().getTime()
      }),
})

export const { cleanError } = appSlice.actions
