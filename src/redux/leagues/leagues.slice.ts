import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { leaguesApi } from '@/redux/leagues/leagues.api'

import { IFELeague } from '@/common/interfaces/league'

interface ILeaguesSliceState {
  leagues: IFELeague[]
  limit: number
  offset: number
  total: number
}

const leaguesSliceState: ILeaguesSliceState = {
  leagues: [],
  limit: 10,
  offset: 0,
  total: 0,
}

export const leaguesSlice = createSlice({
  name: 'leaguesSlice',
  initialState: leaguesSliceState,
  reducers: {
    setPaginationParams: (state, action: PayloadAction<{ limit: number; offset: number }>) => {
      state.limit = action.payload.limit
      state.offset = action.payload.offset
    },
  },
  extraReducers: (builder) =>
    builder.addMatcher(leaguesApi.endpoints.getLeagues.matchFulfilled, (state, action) => {
      state.leagues = action.payload.leagues
      state.total = action.payload.count
    }),
})
