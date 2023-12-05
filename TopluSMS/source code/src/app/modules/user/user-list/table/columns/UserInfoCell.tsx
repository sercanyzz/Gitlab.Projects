/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC} from 'react'
import {User} from '../../../../api/_models'

type Props = {
  user: User
}

const UserInfoCell: FC<Props> = ({user}) => (
  <div className='d-flex align-items-center'>
    <div className='d-flex flex-column'>
      <span className='text-gray-800 mb-1'>{user.nameSurname}</span>
      <span>{user.email}</span>
    </div>
  </div>
)

export {UserInfoCell}
