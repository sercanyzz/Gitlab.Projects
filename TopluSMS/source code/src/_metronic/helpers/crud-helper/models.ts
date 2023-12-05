export type ID = undefined | null | string

export type PaginationState = {
  offset: number
  pageNumber: number
  pageSize: 10 | 30 | 50 | 100
  totalPages: number
}

export type SortState = {
  sort?: string
  sortDir?: 'asc' | 'desc'
}

export type FilterState = {
  filter?: unknown
}

export type SearchState = {
  search?: boolean
  searchField?: string
  firm?: string
  vknNo?: string
  businessPartner?: string
  cdr?: string
  smsTitle?: string
  username?: string
}
export const initialSearchState: SearchState = {
  firm: undefined,
  vknNo: undefined,
  businessPartner: undefined,
  cdr: undefined,
  smsTitle: undefined,
  username: undefined,
}

export type ResponseOld<T> = {
  data?: T
  payload?: {
    message?: string
    errors?: {
      [key: string]: Array<string>
    }
    pagination?: PaginationState
  }
}

export type Link = {
  label?: string
  page?: number
}
export type Pagination = {
  page?: number
  links?: Array<Link>
}

export type Content<T> = {
  content: T
  pageable: {
    offset: number
    pageNumber: number
    pageSize: 10 | 30 | 50 | 100
  }
  totalElements: number
  numberOfElements: number
  totalPages: number
  pagination?: Pagination
}
export type Response<T> = {
  content?: T
  resultCode?: number
  desc?: string
}
export type ListResponse<T> = {
  content?: Content<T>
  resultCode?: number
  desc?: string
}

export type OperationResponse = {
  message?: string
}

export type QueryState = PaginationState & SortState & FilterState & SearchState

export type QueryRequestContextProps = {
  state: QueryState
  updateState: (updates: Partial<QueryState>) => void
}

export const initialQueryState: QueryState = {
  pageNumber: 0,
  pageSize: 10,
  offset: 0,
  totalPages: 1,
}

export const initialQueryRequest: QueryRequestContextProps = {
  state: initialQueryState,
  updateState: () => {},
}

export type QueryResponseContextProps<T> = {
  response?: Response<Array<T>> | undefined
  refetch: () => void
  isLoading: boolean
  query: string
}

export type QueryListResponseContextProps<T> = {
  response?: ListResponse<Array<T>> | undefined
  refetch: () => void
  isLoading: boolean
  query: string
}

export const initialQueryResponse = {refetch: () => {}, isLoading: false, query: ''}

export type ListViewContextProps = {
  selected: Array<ID>
  onSelect: (selectedId: ID) => void
  onSelectAll: () => void
  clearSelected: () => void
  // NULL => (CREATION MODE) | MODAL IS OPENED
  // NUMBER => (EDIT MODE) | MODAL IS OPENED
  // UNDEFINED => MODAL IS CLOSED
  isAllSelected: boolean
  disabled: boolean
}

export const initialListView: ListViewContextProps = {
  selected: [],
  onSelect: () => {},
  onSelectAll: () => {},
  clearSelected: () => {},
  isAllSelected: false,
  disabled: false,
}
