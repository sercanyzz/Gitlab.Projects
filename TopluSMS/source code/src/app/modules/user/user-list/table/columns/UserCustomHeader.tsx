import clsx from 'clsx'
import {FC, PropsWithChildren, useMemo} from 'react'
import {HeaderProps} from 'react-table'
import {initialQueryState} from '../../../../../../_metronic/helpers'
import {useQueryRequest} from '../../../core/QueryRequestProvider'
import {User} from '../../../../api/_models'

type Props = {
  className?: string
  title?: string
  tableProps: PropsWithChildren<HeaderProps<User>>
}
const UserCustomHeader: FC<Props> = ({className, title, tableProps}) => {
  const id = tableProps.column.id
  const {state, updateState} = useQueryRequest()

  const isSelectedForSorting = useMemo(() => {
    return state.sort && state.sort === id
  }, [state, id])
  const sortDir: 'asc' | 'desc' | undefined = useMemo(() => state.sortDir, [state])

  const sortColumn = () => {
    // avoid sorting for these columns
    if (id === 'actions' || id === 'selection') {
      return
    }

    if (!isSelectedForSorting) {
      // enable sort asc
      updateState({sort: id, sortDir: 'asc', ...initialQueryState})
      return
    }

    if (isSelectedForSorting && sortDir !== undefined) {
      if (sortDir === 'asc') {
        // enable sort desc
        updateState({sort: id, sortDir: 'desc', ...initialQueryState})
        return
      }

      // disable sort
      updateState({sort: undefined, sortDir: undefined, ...initialQueryState})
    }
  }

  return (
    <th
      {...tableProps.column.getHeaderProps()}
      className={clsx(
        className,
        isSelectedForSorting && sortDir !== undefined && `table-sort-${sortDir}`
      )}
      // style={{cursor: 'pointer'}} // disabled sort
      // onClick={sortColumn}
    >
      {title}
    </th>
  )
}

export {UserCustomHeader}
