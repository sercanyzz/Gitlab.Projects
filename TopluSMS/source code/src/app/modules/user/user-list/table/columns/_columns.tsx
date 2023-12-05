// @ts-nocheck
import {Column} from 'react-table'
import {UserInfoCell} from './UserInfoCell'
import {UserActionsCell} from './UserActionsCell'
import {UserCustomHeader} from './UserCustomHeader'
import {UserActiveCell} from './UserActiveCell'
import {UserStateCell} from './UserStateCell'
import {UserTextCell} from './UserRoleCell copy'
import {User} from '../../../../api/_models'

const usersColumns: ReadonlyArray<Column<User>> = [
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title='Kullanıcı Adı'
        className='text-center min-w-125px'
      />
    ),
    accessor: 'username',
    Cell: ({...props}) => <UserTextCell text={props.data[props.row.index].username} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Ad Soyad' className='text-center min-w-125px' />
    ),
    id: 'nameSurname',
    Cell: ({...props}) => <UserInfoCell user={props.data[props.row.index]} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Telefon' className='text-center min-w-125px' />
    ),
    id: 'phone',
    Cell: ({...props}) => <UserTextCell text={props.data[props.row.index].phone} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Firma' className='text-center min-w-125px' />
    ),
    id: 'firm',
    Cell: ({...props}) => <UserTextCell text={props.data[props.row.index].companyName} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title='Ücretlenecek Numara'
        className='text-center min-w-125px'
      />
    ),
    id: 'cdr',
    Cell: ({...props}) => <UserTextCell text={props.data[props.row.index].companyCdr} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Rol' className='text-center min-w-125px' />
    ),
    accessor: 'role',
    Cell: ({...props}) => <UserTextCell text={props.data[props.row.index].role} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title='Kilitli'
        className='text-center min-w-80px max-w-80px'
      />
    ),
    id: 'locked',
    Cell: ({...props}) => <UserStateCell state={props.data[props.row.index].lockStatus} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title='Aktivasyon Tarihi'
        className='text-center min-w-125px'
      />
    ),
    accessor: 'activationDate',
    Cell: ({...props}) => <UserTextCell text={props.data[props.row.index].activationDate} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title='Deaktivasyon Tarihi'
        className='text-center min-w-125px'
      />
    ),
    accessor: 'deactivationDate',
    Cell: ({...props}) => <UserTextCell text={props.data[props.row.index].deactivationDate} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title='Durumu'
        className='text-center min-w-80px max-w-80px'
      />
    ),
    id: 'status',
    Cell: ({...props}) => <UserActiveCell status={props.data[props.row.index].status} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='İşlemler' className='text-center min-w-120px' />
    ),
    id: 'actions',
    Cell: ({...props}) => (
      <UserActionsCell
        id={props.data[props.row.index].id}
        name={props.data[props.row.index].nameSurname}
        locked={props.data[props.row.index].lockStatus}
      />
    ),
  },
]

export {usersColumns}
