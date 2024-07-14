import { PayloadAction, createSlice, isAnyOf } from '@reduxjs/toolkit'

import { seasonsApi } from '@/redux/seasons/seasons.api'

import { getNormalizedVersionOfSeason } from '@/utils/season'

import {
  IDeletionSeasonItemError,
  IFESeason,
  IImportSeasonTableRecord,
  ISeasonDuplicate,
} from '@/common/interfaces/season'
import { TErrorDuplicate } from '@/common/types'

interface ISeasonsSliceState {
  seasons: IFESeason[]
  limit: number
  offset: number
  total: number
  order_by: string | null
  createdRecordsNames: string[]
  deletedRecordsErrors: IDeletionSeasonItemError[]
  tableRecords: IImportSeasonTableRecord[]
  duplicates: ISeasonDuplicate[]
}

const seasonsSliceState: ISeasonsSliceState = {
  seasons: [],
  limit: 10,
  offset: 0,
  total: 0,
  order_by: null,
  deletedRecordsErrors: [],
  tableRecords: [],
  createdRecordsNames: [],
  duplicates: [],
}

export const seasonsSlice = createSlice({
  name: 'seasonsSlice',
  initialState: seasonsSliceState,
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
    removeCreatedRecordsNames: (state) => {
      state.createdRecordsNames = []
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
      .addMatcher(seasonsApi.endpoints.getSeasons.matchFulfilled, (state, action) => {
        state.seasons = action.payload.seasons
        state.total = action.payload.count
      })
      .addMatcher(
        isAnyOf(
          seasonsApi.endpoints.deleteAllSeasons.matchFulfilled,
          seasonsApi.endpoints.bulkSeasonsDelete.matchFulfilled,
        ),
        (state, action) => {
          state.deletedRecordsErrors = action.payload.items
        },
      )
      .addMatcher(seasonsApi.endpoints.importSeasonsCSV.matchFulfilled, (state, action) => {
        state.createdRecordsNames = action.payload.success.map((item) => item.name)

        if (action.payload.status !== 'green') {
          const duplicates: ISeasonDuplicate[] = action.payload.duplicates.map((duplicate, idx) => ({
            existing: duplicate.existing,
            new: getNormalizedVersionOfSeason(duplicate.existing.id, duplicate.new),
            index: idx,
          }))

          state.duplicates = duplicates

          state.tableRecords = [
            ...action.payload.duplicates.map((duplicate, idx) => ({
              message: 'A record with this data already exists',
              name: duplicate.existing.name,
              type: 'Duplicate' as TErrorDuplicate,
              idx: idx,
              leagueId: duplicate.existing.league.id,
              leagueName: duplicate.existing.league.name,
              id: duplicate.existing.id,
            })),
            ...action.payload.errors.map((error) => ({
              idx: -1,
              message: error.error,
              name: error['season Name'] || '-',
              type: 'Error' as TErrorDuplicate,
              leagueId: (error.league && error.league.name) || '-',
              leagueName: (error.league && error.league.name) || '-',
              id: '',
            })),
          ]
        }
      }),
})

