import { createApi } from '@reduxjs/toolkit/query/react'

import baseQueryWithReAuth from '@/redux/reauthBaseQuery'

import { IDeleteResponse, IPaginationResponse } from '@/common/interfaces/api'
import {
  IBECreateLeagueBody,
  IBELeague,
  IFELeague,
  IGetLeaguesRequestParams,
  IGetLeaguesResponse,
  IImportLeagueResponse,
} from '@/common/interfaces/league'

const LEAGUE_TAG = 'LEAGUE_TAG'

export const leaguesApi = createApi({
  reducerPath: 'leaguesApi',
  baseQuery: baseQueryWithReAuth,
  tagTypes: [LEAGUE_TAG],
  endpoints: (builder) => ({
    getLeagues: builder.query<IGetLeaguesResponse, IGetLeaguesRequestParams>({
      query: (params) => ({
        url: 'teams/leagues',
        params,
      }),
      providesTags: [LEAGUE_TAG],
      transformResponse: (data: IPaginationResponse<IBELeague[]>) => ({
        count: data.count,
        leagues: data.results.map((league) => ({
          id: league.id,
          type: league.type === 0 ? 'League' : 'Tourn',
          name: league.name,
          description: league.description,
          updatedAt: league.updated_at,
          createdAt: league.created_at,
          playoffFormat: league.playoff_format === 0 ? 'Best Record Wins' : 'Single Elimination Bracket',
          standingsFormat: league.standings_format === 0 ? 'Winning %' : 'Points',
          tiebreakersFormat: league.tiebreakers_format === 0 ? 'Winning %' : 'Points',
          playoffsTeams: league.playoffs_teams,
          welcomeNote: league.welcome_note,
          seasons: league.league_seasons.map((season) => ({ id: season.id, name: season.name })),
        })),
      }),
    }),
    createLeague: builder.mutation<IBELeague, IBECreateLeagueBody>({
      query: (body) => ({
        url: 'teams/leagues',
        method: 'POST',
        body,
      }),
      invalidatesTags: [LEAGUE_TAG],
    }),
    updateLeague: builder.mutation<void, { id: string; body: IBECreateLeagueBody }>({
      query: ({ id, body }) => ({
        url: `teams/leagues/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [LEAGUE_TAG],
    }),
    deleteLeague: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `teams/leagues/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [LEAGUE_TAG],
    }),
    getLeague: builder.query<IFELeague, string>({
      query: (id) => ({
        url: 'teams/leagues/' + id,
      }),
      transformResponse: (league: IBELeague) => ({
        id: league.id,
        type: league.type === 0 ? 'League' : 'Tourn',
        name: league.name,
        description: league.description,
        updatedAt: league.updated_at,
        createdAt: league.created_at,
        playoffFormat: league.playoff_format === 0 ? 'Best Record Wins' : 'Single Elimination Bracket',
        standingsFormat: league.standings_format === 0 ? 'Winning %' : 'Points',
        tiebreakersFormat: league.tiebreakers_format === 0 ? 'Winning %' : 'Points',
        playoffsTeams: league.playoffs_teams,
        welcomeNote: league.welcome_note,
        seasons: league.league_seasons.map((season) => ({ id: season.id, name: season.name })),
      }),
    }),
    bulkDelete: builder.mutation<IDeleteResponse[], { ids: string[] }>({
      query: ({ ids }) => ({
        url: 'teams/leagues/bulk-leagues-delete',
        method: 'POST',
        body: {
          ids,
        },
      }),
      invalidatesTags: [LEAGUE_TAG],
    }),
    deleteAll: builder.mutation<IDeleteResponse[], void>({
      query: () => ({
        url: 'teams/leagues/delete_all',
        method: 'POST',
      }),
      invalidatesTags: [LEAGUE_TAG],
    }),
    importLeagues: builder.mutation<IImportLeagueResponse, { file: FormData }>({
      query: ({ file }) => ({
        url: 'teams/leagues/import-leagues',
        method: 'POST',
        body: {
          file,
        },
      }),
    }),
  }),
})

export const {
  useCreateLeagueMutation,
  useDeleteLeagueMutation,
  useUpdateLeagueMutation,
  useGetLeaguesQuery,
  useGetLeagueQuery,
  useBulkDeleteMutation,
  useDeleteAllMutation,
  useImportLeaguesMutation,
} = leaguesApi
