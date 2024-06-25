import { createSlice } from '@reduxjs/toolkit'

import { leaguesApi } from '@/redux/leagues/leagues.api'

import { IFELeague } from '@/common/interfaces/league'

interface ILeaguesSliceState {
  leagues: IFELeague[]
}

const leaguesSliceState: ILeaguesSliceState = {
  leagues: [],
}

export const leaguesSlice = createSlice({
  name: 'leaguesSlice',
  initialState: leaguesSliceState,
  reducers: {},
  extraReducers: (builder) =>
    builder.addMatcher(leaguesApi.endpoints.getLeagues.matchFulfilled, (state, action) => {
      state.leagues = action.payload
    }),
})

