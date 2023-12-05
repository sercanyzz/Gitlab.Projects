import {FC, useMemo} from 'react'
import {useTable, ColumnInstance, Row} from 'react-table'
import {CustomHeaderColumn} from './columns/CustomHeaderColumn'
import {CustomRow} from './columns/CustomRow'
import {useQueryResponseData, useQueryResponseLoading} from '../../core/QueryResponseProvider'
import {companiesColumns} from './columns/_columns'
import {CompaniesListPagination} from '../../components/pagination/CompaniesListPagination'
import {KTCardBody} from '../../../../../_metronic/helpers'
import {Company} from '../../../api/_models'

const CompaniesTable = () => {
  const companies = useQueryResponseData()
  const isLoading = useQueryResponseLoading()
  const data = useMemo(() => companies, [companies])
  const columns = useMemo(() => companiesColumns, [])
  const {getTableProps, getTableBodyProps, headers, rows, prepareRow} = useTable({
    columns,
    data,
  })

  return (
    <KTCardBody className='py-4'>
      <div className='table-responsive'>
        <table
          id='kt_table_companies'
          className='table table-bordered table-row-gray-300 align-middle table-row-dashed fs-6 gy-5 dataTable no-footer'
          {...getTableProps()}
        >
          <thead>
            <tr className='text-start text-muted fw-bolder fs-7 gs-0 bg-light'>
              {headers.map((column: ColumnInstance<Company>) => (
                <CustomHeaderColumn key={column.id} column={column} />
              ))}
            </tr>
          </thead>
          <tbody className='text-gray-600 fw-bold' {...getTableBodyProps()}>
            {isLoading ? (
              <SingleLine message='Yükleniyor' />
            ) : rows.length > 0 ? (
              rows.map((row: Row<Company>, i) => {
                prepareRow(row)
                return <CustomRow row={row} key={`row-${i}-${row.id}`} />
              })
            ) : (
              <SingleLine message='Firma listesi boş' />
            )}
          </tbody>
        </table>
      </div>
      <CompaniesListPagination />
    </KTCardBody>
  )
}

type RowProps = {
  message: string
}
const SingleLine: FC<RowProps> = ({message}) => {
  return (
    <tr>
      <td colSpan={11}>
        <div className='d-flex text-center w-100 align-content-center justify-content-center'>
          {message}
        </div>
      </td>
    </tr>
  )
}

export {CompaniesTable}
