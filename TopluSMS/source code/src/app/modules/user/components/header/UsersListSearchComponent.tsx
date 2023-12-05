/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useState} from 'react'
import {
  initialQueryState,
  initialSearchState,
  KTIcon,
  useDebounce,
} from '../../../../../_metronic/helpers'
import {useQueryRequest} from '../../core/QueryRequestProvider'
import Select from 'react-select'
import {selectTheme} from '../../../theme'
import {Option} from '../../../api/_models'

const searchOptions = [
  {value: 'username', label: 'Kullanıcı Adı'},
  {value: 'cdr', label: 'Ücretlendirilecek Numara'},
  {value: 'firm', label: 'Firma'},
]
const UsersListSearchComponent = () => {
  const {updateState} = useQueryRequest()
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [searchField, setSearchField] = useState<Option>(searchOptions[0])
  // Debounce search term so that it only gives us latest value ...
  // ... if searchTerm has not been updated within last 500ms.
  // The goal is to only have the API call fire when user stops typing ...
  // ... so that we aren't hitting our API rapidly.
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  // Effect for API call
  useEffect(
    () => {
      if (
        debouncedSearchTerm !== undefined &&
        searchTerm !== undefined &&
        searchField.value !== undefined
      ) {
        if (debouncedSearchTerm !== '') {
          updateState({
            ...initialSearchState,
            search: debouncedSearchTerm !== '',
            [searchField.value]: debouncedSearchTerm,
            ...initialQueryState,
          })
        } else {
          updateState({
            ...initialSearchState,
            search: true,
            ...initialQueryState,
          })
        }
      }
    },
    [debouncedSearchTerm, searchField.value] // Only call effect if debounced search term changes
    // More details about useDebounce: https://usehooks.com/useDebounce/
  )
  const selectFieldChange = ({value, label}: any) => {
    setSearchField({value: value, label: label})
  }
  return (
    <div className='card-title d-flex flex-wrap'>
      {/* begin::Search */}
      <div className='d-flex align-items-center position-relative my-1'>
        <Select
          placeholder='Seçiniz'
          defaultValue={searchField}
          options={searchOptions}
          onChange={selectFieldChange}
          theme={selectTheme}
          className='w-200px me-10'
        />
      </div>
      <div className='d-flex align-items-center position-relative my-1'>
        <KTIcon iconName='magnifier' className='fs-1 position-absolute ms-6' />
        <input
          type='text'
          data-kt-user-table-filter='search'
          className='form-control form-control-solid w-200px ps-14'
          placeholder='Kullanıcı Ara'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {/* end::Search */}
    </div>
  )
}

export {UsersListSearchComponent}
