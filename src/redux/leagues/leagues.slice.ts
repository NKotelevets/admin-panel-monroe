import { PayloadAction, createSlice, isAnyOf } from '@reduxjs/toolkit'

import { leaguesApi } from '@/redux/leagues/leagues.api'

import { getNormalizedNewVersionOfLeagueTourn } from '@/utils/league'

import { IDeletionItemError } from '@/common/interfaces/api'
import { IDuplicate, IFELeague } from '@/common/interfaces/league'

interface ILeagueImportInfoTableRecord {
  name: string
  message: string
  type: 'Error' | 'Duplicate'
  idx: number
}

interface ILeaguesSliceState {
  leagues: IFELeague[]
  limit: number
  offset: number
  total: number
  order_by: 'asc' | 'desc'
  deletedRecordsErrors: IDeletionItemError[]
  createdRecordsNames: string[]
  duplicates: IDuplicate[]
  tableRecords: ILeagueImportInfoTableRecord[]
}

const leaguesSliceState: ILeaguesSliceState = {
  leagues: [],
  limit: 10,
  offset: 0,
  total: 0,
  order_by: 'asc',
  deletedRecordsErrors: [],
  createdRecordsNames: [],
  duplicates: [],
  tableRecords: [],
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
        order_by: string
      }>,
    ) => {
      state.limit = action.payload.limit
      state.offset = action.payload.offset
      state.order_by = action.payload.order_by as 'asc' | 'desc'
    },
    removeDuplicate: (state, action: PayloadAction<number>) => {
      const remainingDuplicates = state.duplicates.filter((duplicate) => duplicate.index !== action.payload)
      const remainingTableRecords = state.tableRecords.filter((tableRecord) => tableRecord.idx !== action.payload)

      state.duplicates = remainingDuplicates
      state.tableRecords = remainingTableRecords
    },
  },
  extraReducers: (builder) =>
    builder
      .addMatcher(leaguesApi.endpoints.getLeagues.matchFulfilled, (state, action) => {
        state.leagues = action.payload.leagues
        state.total = action.payload.count
      })
      .addMatcher(leaguesApi.endpoints.importLeagues.matchFulfilled, (state, action) => {
        state.createdRecordsNames = action.payload.success.map((item) => item.name)
        state.duplicates = action.payload.duplicates.map((duplicate, idx) => ({
          existing: duplicate.existing,
          new: getNormalizedNewVersionOfLeagueTourn(duplicate.existing.id, duplicate.new),
          index: idx,
        }))
        state.tableRecords = [
          ...(action.payload.duplicates.map((duplicate, idx) => {
            return {
              message: 'A file with this data already exists',
              name: duplicate.existing.name,
              type: 'Duplicate',
              idx: idx,
            }
          }) as ILeagueImportInfoTableRecord[]),
          ...(action.payload.errors.map((error) => ({
            idx: -1,
            message: error.error,
            name: error.league_name,
            type: 'Error',
          })) as ILeagueImportInfoTableRecord[]),
        ]
      })
      .addMatcher(
        isAnyOf(leaguesApi.endpoints.deleteAll.matchFulfilled, leaguesApi.endpoints.bulkDelete.matchFulfilled),
        (state, action) => {
          state.deletedRecordsErrors = action.payload.items
        },
      ),
})
