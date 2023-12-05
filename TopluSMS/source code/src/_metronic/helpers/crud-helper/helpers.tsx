import {createContext, Dispatch, SetStateAction, useEffect, useState} from 'react'
import qs from 'qs'
import {ID, QueryListResponseContextProps, QueryResponseContextProps, QueryState} from './models'
import {toast} from 'react-toastify'

function showSuccessMessage(message: string) {
  toast.success(message, {
    position: 'top-right',
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
  })
}

function showErrorMessage(message: string) {
  toast.error(message, {
    position: 'top-right',
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
  })
}

function showInfoMessage(message: string) {
  toast.info(message, {
    position: 'top-right',
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
  })
}

function createResponseContext<T>(initialState: QueryResponseContextProps<T>) {
  return createContext(initialState)
}
function createListResponseContext<T>(initialState: QueryListResponseContextProps<T>) {
  return createContext(initialState)
}

function isNotEmpty(obj: unknown) {
  return obj !== undefined && obj !== null && obj !== ''
}

// Example: page=1&items_per_page=10&sort=id&order=desc&search=a&filter_name=a&filter_online=false
function stringifyRequestQuery(state: QueryState): string {
  const pagination = qs.stringify(state, {filter: ['pageNumber', 'pageSize'], skipNulls: true})
  const sort = qs.stringify(state, {filter: ['sort', 'sortDir'], skipNulls: true})
  console.log('state')
  console.log(state)
  console.log('state.search')
  console.log(state.search)
  const search = isNotEmpty(state.search)
    ? qs.stringify(state, {
        filter: ['firm', 'vknNo', 'businessPartner', 'cdr', 'smsTitle', 'username'],
        skipNulls: true,
      })
    : ''

  const filter = state.filter
    ? Object.entries(state.filter as Object)
        .filter((obj) => isNotEmpty(obj[1]))
        .map((obj) => {
          return `filter_${obj[0]}=${obj[1]}`
        })
        .join('&')
    : ''

  return [pagination, sort, search, filter].filter((f) => f).join('&')
}

function parseRequestQuery(query: string): QueryState {
  const cache: unknown = qs.parse(query)
  return cache as QueryState
}

function calculatedGroupingIsDisabled<T>(isLoading: boolean, data: Array<T> | undefined): boolean {
  if (isLoading) {
    return true
  }

  return !data || !data.length
}

function calculateIsAllDataSelected<T>(data: Array<T> | undefined, selected: Array<ID>): boolean {
  if (!data) {
    return false
  }

  return data.length > 0 && data.length === selected.length
}

function groupingOnSelect(
  id: ID,
  selected: Array<ID>,
  setSelected: Dispatch<SetStateAction<Array<ID>>>
) {
  if (!id) {
    return
  }

  if (selected.includes(id)) {
    setSelected(selected.filter((itemId) => itemId !== id))
  } else {
    const updatedSelected = [...selected]
    updatedSelected.push(id)
    setSelected(updatedSelected)
  }
}

function groupingOnSelectAll<T>(
  isAllSelected: boolean,
  setSelected: Dispatch<SetStateAction<Array<ID>>>,
  data?: Array<T & {id?: ID}>
) {
  if (isAllSelected) {
    setSelected([])
    return
  }

  if (!data || !data.length) {
    return
  }

  setSelected(data.filter((item) => item.id).map((item) => item.id))
}

// Hook
function useDebounce(value: string | undefined, delay: number) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value)
      }, delay)
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler)
      }
    },
    [value, delay] // Only re-call effect if value or delay changes
  )
  return debouncedValue
}

function isVKNValid(vkn: string) {
  let tmp
  let sum = 0
  const lastDigit = parseInt(vkn.charAt(9), 10)
  for (let i = 0; i < 9; i++) {
    const digit = parseInt(vkn.charAt(i), 10)
    tmp = (digit + 10 - (i + 1)) % 10
    sum = tmp === 9 ? sum + tmp : sum + ((tmp * Math.pow(2, 10 - (i + 1))) % 9)
  }
  return lastDigit === (10 - (sum % 10)) % 10
}

export {
  createResponseContext,
  createListResponseContext,
  stringifyRequestQuery,
  parseRequestQuery,
  calculatedGroupingIsDisabled,
  calculateIsAllDataSelected,
  groupingOnSelect,
  groupingOnSelectAll,
  useDebounce,
  isNotEmpty,
  showInfoMessage,
  showSuccessMessage,
  showErrorMessage,
  isVKNValid,
}
