import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { authApi } from '@/redux/auth/auth.api'
import { leaguesApi } from '@/redux/leagues/leagues.api'
import { userApi } from '@/redux/user/user.api'

import { IDetailedError, INamedDetailsError } from '@/common/interfaces'

interface IAppNotification {
  message: string
  timestamp: number
  type: 'success' | 'error' | 'info'
}

interface IAppSliceState {
  notification: IAppNotification
}

const EMPTY_NOTIFICATION: IAppNotification = {
  message: '',
  timestamp: 0,
  type: 'error',
}

const authSliceState: IAppSliceState = {
  notification: EMPTY_NOTIFICATION,
}

export const appSlice = createSlice({
  name: 'appSlice',
  initialState: authSliceState,
  reducers: {
    clearNotification: (state) => {
      state.notification = EMPTY_NOTIFICATION
    },
    setAppNotification: (state, action: PayloadAction<IAppNotification>) => {
      state.notification = action.payload
    },
  },
  extraReducers: (builder) =>
    builder
      .addMatcher(userApi.endpoints.getUser.matchRejected, (state, action) => {
        state.notification.message = (action.payload?.data as IDetailedError).details
        state.notification.timestamp = new Date().getTime()
      })
      .addMatcher(authApi.endpoints.signIn.matchRejected, (state) => {
        state.notification.message = 'Invalid Email/Password'
        state.notification.timestamp = new Date().getTime()
      })
      .addMatcher(leaguesApi.endpoints.createLeague.matchRejected, (state, action) => {
        state.notification.message = (action.payload?.data as INamedDetailsError).details.name[0]
        state.notification.timestamp = new Date().getTime()
      })
      .addMatcher(leaguesApi.endpoints.deleteLeague.matchRejected, (state, action) => {
        state.notification.message = (action.payload?.data as IDetailedError).details
        state.notification.timestamp = new Date().getTime()
      }),
})
