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
  payoffs_teams: number
  welcome_note: string
}

export interface IBECreateLeagueBody extends Omit<IBELeague, 'id' | 'updated_at' | 'created_at' | 'payoffs_teams'> {}

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
  payoffsTeams: number
}

export interface IFECreateLeagueBody {
  welcomeNote: string
  type: number
  playoffFormat: number
  standingsFormat: number
  tiebreakersFormat: number
  name: string
  description: string
}
