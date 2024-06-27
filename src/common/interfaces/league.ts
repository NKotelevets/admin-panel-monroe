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

export interface IFELeague extends ICommonLeagueFields {
  type: number
  updatedAt: string
  createdAt: string
  playoffFormat: number
  standingsFormat: number
  tiebreakersFormat: number
  payoffsTeams: number
  welcomeNote: string
}

export interface IFECreateLeagueBody extends Omit<IFELeague, 'id' | 'updatedAt' | 'createdAt' | 'payoffsTeams'> {}
