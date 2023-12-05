// @ts-nocheck
import {Column} from 'react-table'
import {ActionsCell} from './ActionsCell'
import {CompanyCustomHeader} from './CompanyCustomHeader'
import {StateCell} from './StateCell'
import {Company} from '../../../core/_models'
import {TextCell} from './TextCell'
import {UseTypeCell} from './UseTypeCell'

export const companiesColumns: ReadonlyArray<Column<Company>> = [
  {
    Header: (props) => (
      <CompanyCustomHeader tableProps={props} title='Firma' className='text-center min-w-125px' />
    ),
    id: 'firm',
    Cell: ({...props}) => <TextCell text={props.data[props.row.index].firm} />,
  },
  {
    Header: (props) => (
      <CompanyCustomHeader
        tableProps={props}
        title='İş Ortağı Adı'
        className='text-center min-w-125px'
      />
    ),
    id: 'businessPartner',
    Cell: ({...props}) => <TextCell text={props.data[props.row.index].businessPartner} />,
  },
  {
    Header: (props) => (
      <CompanyCustomHeader
        tableProps={props}
        title='Ücretlenecek Numara'
        className='text-center min-w-125px'
      />
    ),
    id: 'chargedNumber',
    Cell: ({...props}) => <TextCell text={props.data[props.row.index].chargedNumber} />,
  },
  {
    Header: (props) => (
      <CompanyCustomHeader
        tableProps={props}
        title='Kullanım Tipi'
        className='text-center min-w-125px'
      />
    ),
    id: 'useType',
    Cell: ({...props}) => <UseTypeCell text={props.data[props.row.index].useType} />,
  },
  {
    Header: (props) => (
      <CompanyCustomHeader
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
      <CompanyCustomHeader
        tableProps={props}
        title='İşlemler'
        className='text-center min-w-120px'
      />
    ),
    id: 'actions',
    Cell: ({...props}) => (
      <ActionsCell id={props.data[props.row.index].id} name={props.data[props.row.index].firm} />
    ),
  },
]
