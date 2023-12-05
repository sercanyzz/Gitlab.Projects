import {useNavigate} from 'react-router-dom'
import {KTIcon} from '../../../../../_metronic/helpers'

const UsersListToolbar = () => {
  const navigate = useNavigate()
  return (
    <div className='d-flex justify-content-end' data-kt-user-table-toolbar='base'>
      {/* begin::Add user */}
      <button type='button' className='btn btn-primary' onClick={() => navigate('/users/add')}>
        <KTIcon iconName='plus' className='fs-2' />
        Kullanıcı ekle
      </button>
      {/* end::Add user */}
    </div>
  )
}

export {UsersListToolbar}
