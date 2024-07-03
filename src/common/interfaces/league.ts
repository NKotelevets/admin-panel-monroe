import { IIdName } from './index'

import { IBESeason } from '@/common/interfaces/season'

interface ICommonLeagueFields {
  id: string
  name: string
  description: string
}

export interface IBELeague extends ICommonLeagueFields {
  type: number
  updated_at: string
  created_at: string
  playoff_format: number
  standings_format: number
  tiebreakers_format: number
  playoffs_teams: number
  welcome_note: string
  league_seasons: IBESeason[]
}

export interface IBECreateLeagueBody extends Omit<IBELeague, 'id' | 'updated_at' | 'created_at' | 'league_seasons'> {}

type TWinningPoints = 'Winning %' | 'Points'

type TPlayOffFormat = 'Best Record Wins' | 'Single Elimination Bracket'

type TLeagueTourn = 'League' | 'Tourn'

export interface IFELeague extends ICommonLeagueFields {
  updatedAt: string
  createdAt: string
  welcomeNote: string
  type: TLeagueTourn
  playoffFormat: TPlayOffFormat
  standingsFormat: TWinningPoints
  tiebreakersFormat: TWinningPoints
  playoffsTeams: number
  seasons: IIdName[]
}

export interface IFECreateLeagueBody {
  welcomeNote: string
  type: number
  playoffFormat: number
  standingsFormat: number
  tiebreakersFormat: number
  name: string
  description: string
  playoffsTeams: number
}

interface IImportLeagueSuccess {
  name: string
}

interface IImportLeagueError {
  index: number
  error: string
}

interface IImportLeagueDuplicatesExisting {
  id: string
  updated_at: string
  created_at: string
  type: number
  playoff_format: number
  standings_format: number
  tiebreakers_format: number
  name: string
  description: string
  welcome_note: string
  playoffs_teams: number
}

interface ILeagueChanges extends Omit<IBELeague, 'id' | 'updated_at' | 'created_at'> {}

interface IImportLeagueDuplicates {
  index: number
  existing: IImportLeagueDuplicatesExisting[]
  new: Partial<ILeagueChanges>
  differences: Partial<ILeagueChanges>
}

export interface IImportLeagueResponse {
  status: ''
  success: IImportLeagueSuccess[]
  errors: IImportLeagueError[]
  duplicates: IImportLeagueDuplicates[]
}

export interface IGetLeaguesRequestParams {
  limit: number
  offset: number
  league_name?: string | undefined
  playoff_format?: string | undefined
  standings_format?: string | undefined
  tiebreakers_format?: string | undefined
  type?: string | undefined
  order_by?: string
}

export interface IGetLeaguesResponse {
  count: number
  leagues: IFELeague[]
}
