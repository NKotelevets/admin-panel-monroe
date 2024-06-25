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

export interface IBECreateLeagueBody extends Omit<IBELeague, 'id' | 'updated_at' | 'created_at'> {}

export interface IFELeague extends ICommonLeagueFields {
  type: string
  updatedAt: string
  createdAt: string
  playoffFormat: string
  standingsFormat: string
  tiebreakersFormat: string
  payoffsTeams: number
  welcomeNote: string
}

export interface IFECreateLeagueBody extends Omit<IFELeague, 'id' | 'updatedAt' | 'createdAt'> {}

