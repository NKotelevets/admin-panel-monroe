import { TDeletionStatus } from '@/common/types'

export interface IPaginationResponse<T> {
  count: number
  prev: string
  next: string
  results: T
}

export interface IDeletionItemError {
  id: string
  error: string
  name: string
}

export interface IDeleteResponse {
  status: TDeletionStatus
  total: number
  success: number
  items: IDeletionItemError[]
}
