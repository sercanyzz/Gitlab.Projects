/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC, useEffect} from 'react'
import clsx from 'clsx'
import {MenuComponent} from '../../../../../../_metronic/assets/ts/components'
import {ID, KTIcon} from '../../../../../../_metronic/helpers'
import {Link} from 'react-router-dom'
import {OverlayTrigger, Tooltip} from 'react-bootstrap'

type Props = {
  id: ID
  name: string
}

const ActionsCell: FC<Props> = ({id, name}) => {
  useEffect(() => {
    MenuComponent.reinitialization()
  }, [])

  return (
    <div className='min-w-100px'>
      <OverlayTrigger
        key='view'
        placement='top'
        overlay={<Tooltip id='tooltip-copy-to-clipboard'>Görüntüle</Tooltip>}
      >
        <Link
          title='Görüntüle'
          className={clsx('btn btn-icon btn-bg-light btn-active-color-warning btn-sm me-1 mb-1')}
          to={'../view/' + id}
        >
          <KTIcon iconName='eye' className='fs-2' />
        </Link>
      </OverlayTrigger>
      <OverlayTrigger
        key='edit'
        placement='top'
        overlay={<Tooltip id='tooltip-copy-to-clipboard'>Güncelle</Tooltip>}
      >
        <Link
          title='Güncelle'
          className={clsx('btn btn-icon btn-bg-light btn-active-color-success btn-sm me-1 mb-1')}
          to={'../edit/' + id}
        >
          <KTIcon iconName='pencil' className='fs-2' />
        </Link>
      </OverlayTrigger>
    </div>
  )
}

export {ActionsCell}
