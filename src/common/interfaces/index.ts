export interface IDetailedError {
  code: string
  details: string
}

export interface INamedDetailsError {
  code: string
  details: {
    name: string[]
  }
}
