import {useNavigate} from 'react-router-dom'
import {KTIcon} from '../../../../../_metronic/helpers'

export const CompaniesListToolbar = () => {
  const navigate = useNavigate()
  return (
    <div className='d-flex justify-content-end' data-kt-sms-header-table-toolbar='base'>
      {/* begin::Add company */}
      <button type='button' className='btn btn-primary' onClick={() => navigate('/companies/add')}>
        <KTIcon iconName='plus' className='fs-2' />
        Firma ekle
      </button>

      {/* end::Add company */}
    </div>
  )
}
