/* eslint-disable react-hooks/exhaustive-deps */
import {FC, useContext, useState, useEffect, useMemo} from 'react'
import {useQuery} from 'react-query'
import {
  createListResponseContext,
  initialQueryResponse,
  initialQueryState,
  PaginationState,
  QUERIES,
  stringifyRequestQuery,
  WithChildren,
} from '../../../../_metronic/helpers'
import {useQueryRequest} from './QueryRequestProvider'
import {Company} from '../../api/_models'
import {getCompanies} from '../../api/_requests'

const QueryResponseContext = createListResponseContext<Company>(initialQueryResponse)
const QueryResponseProvider: FC<WithChildren> = ({children}) => {
  const {state} = useQueryRequest()
  const [query, setQuery] = useState<string>(stringifyRequestQuery(state))
  const updatedQuery = useMemo(() => stringifyRequestQuery(state), [state])

  useEffect(() => {
    if (query !== updatedQuery) {
      setQuery(updatedQuery)
    }
  }, [updatedQuery])

  const {
    isFetching,
    refetch,
    data: response,
  } = useQuery(
    `${QUERIES.USERS_LIST}-${query}`,
    () => {
      return getCompanies(query)
    },
    {cacheTime: 0, keepPreviousData: true, refetchOnWindowFocus: false}
  )

  return (
    <QueryResponseContext.Provider value={{isLoading: isFetching, refetch, response, query}}>
      {children}
    </QueryResponseContext.Provider>
  )
}

const useQueryResponse = () => useContext(QueryResponseContext)

const useQueryResponseData = () => {
  const {response} = useQueryResponse()
  if (!response) {
    return []
  }

  return response?.content?.content || []
}

const useQueryResponsePagination = () => {
  const defaultPaginationState: PaginationState = {
    ...initialQueryState,
  }

  const {response} = useQueryResponse()
  if (
    !response ||
    !response.content ||
    !response.content.pageable ||
    !response.content.totalPages
  ) {
    return defaultPaginationState
  }

  return response.content.pageable
}

const useQueryResponseLoading = (): boolean => {
  const {isLoading} = useQueryResponse()
  return isLoading
}

export {
  QueryResponseProvider,
  useQueryResponse,
  useQueryResponseData,
  useQueryResponsePagination,
  useQueryResponseLoading,
}
