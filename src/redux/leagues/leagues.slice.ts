import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { leaguesApi } from '@/redux/leagues/leagues.api'

import { IFELeague } from '@/common/interfaces/league'

interface ILeaguesSliceState {
  leagues: IFELeague[]
  limit: number
  offset: number
  total: number
  league_name: string
  type: string
  playoff_format: string
  standings_format: string
  tiebreakers_format: string
  order_by: 'asc' | 'desc'
}

const leaguesSliceState: ILeaguesSliceState = {
  leagues: [],
  limit: 10,
  offset: 0,
  total: 0,
  type: '',
  league_name: '',
  playoff_format: '',
  standings_format: '',
  tiebreakers_format: '',
  order_by: 'asc',
}

export const leaguesSlice = createSlice({
  name: 'leaguesSlice',
  initialState: leaguesSliceState,
  reducers: {
    setPaginationParams: (
      state,
      action: PayloadAction<{
        limit: number
        offset: number
        league_name?: string
        type?: string
        playoff_format?: string
        standings_format?: string
        tiebreakers_format?: string
        order_by: 'asc' | 'desc'
      }>,
    ) => {
      state.limit = action.payload.limit
      state.offset = action.payload.offset
      state.league_name = action.payload.league_name || ''
      state.type = action.payload.type || ''
      state.playoff_format = action.payload.playoff_format || ''
      state.standings_format = action.payload.standings_format || ''
      state.tiebreakers_format = action.payload.tiebreakers_format || ''
      state.order_by = action.payload.order_by
    },
  },
  extraReducers: (builder) =>
    builder.addMatcher(leaguesApi.endpoints.getLeagues.matchFulfilled, (state, action) => {
      state.leagues = action.payload.leagues
      state.total = action.payload.count
    }),
})
