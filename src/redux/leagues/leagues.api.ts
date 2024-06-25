import { createApi } from '@reduxjs/toolkit/query/react'

import baseQueryWithReAuth from '@/redux/reauthBaseQuery'

import { IBECreateLeagueBody, IBELeague, IFELeague } from '@/common/interfaces/league'

export const leaguesApi = createApi({
  reducerPath: 'leaguesApi',
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    getLeagues: builder.query<IFELeague[], void>({
      query: () => ({
        url: 'teams/leagues',
      }),
      transformResponse: (leagues: IBELeague[]) =>
        leagues.map((league) => ({
          id: league.id,
          type: league.type === 0 ? 'League' : 'Tourn',
          name: league.name,
          description: league.description,
          updatedAt: league.updated_at,
          createdAt: league.created_at,
          playoffFormat: league.playoff_format === 0 ? 'Best Record Wins' : 'Single Elimination Bracket',
          standingsFormat: league.standings_format === 0 ? 'Winning %' : 'Points',
          tiebreakersFormat: league.tiebreakers_format === 0 ? 'Winning %' : 'Points',
          payoffsTeams: league.payoffs_teams,
          welcomeNote: league.welcome_note,
        })),
    }),
    createLeague: builder.mutation<IBELeague, IBECreateLeagueBody>({
      query: (body) => ({
        url: 'teams/leagues',
        method: 'POST',
        body,
      }),
    }),
    updateLeague: builder.mutation<void, { id: string; body: IBECreateLeagueBody }>({
      query: ({ id, body }) => ({
        url: `teams/leagues/${id}`,
        method: 'PATCH',
        body,
      }),
    }),
    deleteLeague: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `teams/leagues/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
})

export const { useCreateLeagueMutation, useDeleteLeagueMutation, useUpdateLeagueMutation, useGetLeaguesQuery } =
  leaguesApi

