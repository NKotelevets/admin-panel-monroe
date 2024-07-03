interface ISeasonCommonFields {
  id: string
  name: string
  league: string
  divisions: string[]
}

export interface IBESeason extends ISeasonCommonFields {
  updated_at: string
  created_at: string
  start_date: string
  expected_end_date: string
}

