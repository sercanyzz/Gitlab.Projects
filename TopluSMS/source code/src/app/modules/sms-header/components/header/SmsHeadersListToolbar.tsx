import {useNavigate} from 'react-router-dom'
import {KTIcon} from '../../../../../_metronic/helpers'

export const SmsHeadersListToolbar = () => {
  const navigate = useNavigate()
  return (
    <div className='d-flex justify-content-end' data-kt-sms-header-table-toolbar='base'>
      {/* begin::Add smsHeader */}
      <button
        type='button'
        className='btn btn-primary'
        onClick={() => navigate('/sms-headers/add')}
      >
        <KTIcon iconName='plus' className='fs-2' />
        Sms Başlığı ekle
      </button>

      {/* end::Add smsHeader */}
    </div>
  )
}
