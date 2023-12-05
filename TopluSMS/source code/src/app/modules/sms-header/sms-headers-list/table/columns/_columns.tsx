// @ts-nocheck
import {Column} from 'react-table'
import {ActionsCell} from './ActionsCell'
import {SmsHeaderCustomHeader} from './SmsHeaderCustomHeader'
import {StateCell} from './StateCell'
import {SmsHeader} from '../../../core/_models'
import {TextCell} from './TextCell'

export const smsHeadersColumns: ReadonlyArray<Column<SmsHeader>> = [
  {
    Header: (props) => (
      <SmsHeaderCustomHeader
        tableProps={props}
        title='Sms Başlığı'
        className='text-center min-w-125px'
      />
    ),
    id: 'smsTitle',
    Cell: ({...props}) => <TextCell text={props.data[props.row.index].smsTitle} />,
  },
  {
    Header: (props) => (
      <SmsHeaderCustomHeader tableProps={props} title='Firma' className='text-center min-w-125px' />
    ),
    id: 'firm',
    Cell: ({...props}) => <TextCell text={props.data[props.row.index].companyName} />,
  },
  {
    Header: (props) => (
      <SmsHeaderCustomHeader
        tableProps={props}
        title='Ücretlenecek Numara'
        className='text-center min-w-125px'
      />
    ),
    id: 'cdr',
    Cell: ({...props}) => <TextCell text={props.data[props.row.index].companyCdr} />,
  },
  {
    Header: (props) => (
      <SmsHeaderCustomHeader
        tableProps={props}
        title='Aktivasyon Tarihi'
        className='text-center min-w-125px'
      />
    ),
    id: 'activationDate',
    Cell: ({...props}) => <TextCell text={props.data[props.row.index].activationDate} />,
  },
  {
    Header: (props) => (
      <SmsHeaderCustomHeader
        tableProps={props}
        title='Deaktivasyon Tarihi'
        className='text-center min-w-125px'
      />
    ),
    id: 'deactivationDate',
    Cell: ({...props}) => <TextCell text={props.data[props.row.index].deactivationDate} />,
  },
  {
    Header: (props) => (
      <SmsHeaderCustomHeader
        tableProps={props}
        title='Durumu'
        className='text-center min-w-80px max-w-80px'
      />
    ),
    id: 'status',
    Cell: ({...props}) => <StateCell active={props.data[props.row.index].status} />,
  },
  {
    Header: (props) => (
      <SmsHeaderCustomHeader
        tableProps={props}
        title='İşlemler'
        className='text-center min-w-120px'
      />
    ),
    id: 'actions',
    Cell: ({...props}) => (
      <ActionsCell
        id={props.data[props.row.index].id}
        name={props.data[props.row.index].nameSurname}
        locked={props.data[props.row.index].locked}
      />
    ),
  },
]
