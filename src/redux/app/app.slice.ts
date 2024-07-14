import { PayloadAction, createSlice, isAnyOf } from '@reduxjs/toolkit'

import { authApi } from '@/redux/auth/auth.api'
import { leaguesApi } from '@/redux/leagues/leagues.api'
import { seasonsApi } from '@/redux/seasons/seasons.api'
import { userApi } from '@/redux/user/user.api'

import { IDetailedError, INamedDetailsError } from '@/common/interfaces'

interface IInfoNotification {
  message: string
  redirectedPageUrl: string
  actionLabel: string
}

interface IAppNotification {
  message: string
  timestamp: number
  type: 'success' | 'error' | 'info'
}

interface IAppSliceState {
  notification: IAppNotification
  infoNotification: IInfoNotification
}

const EMPTY_NOTIFICATION: IAppNotification = {
  message: '',
  timestamp: 0,
  type: 'error',
}

const EMPTY_INFO_NOTIFICATION: IInfoNotification = {
  message: '',
  actionLabel: '',
  redirectedPageUrl: '',
}

const authSliceState: IAppSliceState = {
  notification: EMPTY_NOTIFICATION,
  infoNotification: EMPTY_INFO_NOTIFICATION,
}

export const appSlice = createSlice({
  name: 'appSlice',
  initialState: authSliceState,
  reducers: {
    clearNotification: (state) => {
      state.notification = EMPTY_NOTIFICATION
    },
    clearInfoNotification: (state) => {
      state.infoNotification = EMPTY_INFO_NOTIFICATION
    },
    setAppNotification: (state, action: PayloadAction<IAppNotification>) => {
      state.notification = action.payload
    },
    setInfoNotification: (state, action: PayloadAction<IInfoNotification>) => {
      state.infoNotification = action.payload
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
      .addMatcher(
        isAnyOf(leaguesApi.endpoints.createLeague.matchRejected, leaguesApi.endpoints.updateLeague.matchRejected),
        (state, action) => {
          state.notification.message = (action.payload?.data as INamedDetailsError).details.name[0]
          state.notification.timestamp = new Date().getTime()
        },
      )
      .addMatcher(leaguesApi.endpoints.deleteLeague.matchRejected, (state, action) => {
        state.notification.message = (action.payload?.data as IDetailedError).details
        state.notification.timestamp = new Date().getTime()
      })
      .addMatcher(seasonsApi.endpoints.deleteSeason.matchRejected, (state, action) => {
        state.notification.message = (action.payload?.data as { error: string }).error
        state.notification.timestamp = new Date().getTime()
      }),
})
