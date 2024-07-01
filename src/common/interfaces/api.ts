export interface IPaginationResponse<T> {
  count: number
  prev: string
  next: string
  results: T
}

export interface IDeleteResponse {
  code: string
  details: string
}
