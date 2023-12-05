import {useQueryRequest} from '../../core/QueryRequestProvider'
import {useQueryResponse} from '../../core/QueryResponseProvider'
import Select from 'react-select'
import {selectTheme} from '../../../theme'

const pageSizeOptions = [
  {value: 10, label: '10'},
  {value: 30, label: '30'},
  {value: 50, label: '50'},
  {value: 100, label: '100'},
]

export const UsersListFooter = () => {
  const {state, updateState} = useQueryRequest()
  const {response} = useQueryResponse()
  const elementCount = response?.content?.numberOfElements
  const totalElementCount = response?.content?.numberOfElements
  const changePageSize = ({value}: any) => {
    updateState({
      ...state,
      pageSize: value,
    })
  }
  var initialValue = pageSizeOptions.filter((val) => val.value === state.pageSize)
  return (
    <div className='card-header border-0 pt-6'>
      <div className='card-title d-flex flex-wrap'>
        <div className='d-flex align-items-center position-relative my-1'>
          <Select
            placeholder='Seçiniz'
            defaultValue={initialValue}
            options={pageSizeOptions}
            onChange={changePageSize}
            theme={selectTheme}
            className='w-100px me-3 '
          />
          <span> kullanıcı göster</span>
        </div>
      </div>
      <div className='card-title d-flex flex-wrap'>
        {elementCount
          ? `Toplam ${totalElementCount} kullanıcıdan ${elementCount} tanesi gösteriliyor`
          : 'Kullanıcı Bulunmamaktadır'}
      </div>
    </div>
  )
}
