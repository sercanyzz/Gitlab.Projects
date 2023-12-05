/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC, useState, useEffect} from 'react'
import clsx from 'clsx'
import {useMutation, useQueryClient} from 'react-query'
import {MenuComponent} from '../../../../../../_metronic/assets/ts/components'
import {
  ID,
  KTIcon,
  QUERIES,
  showErrorMessage,
  showSuccessMessage,
} from '../../../../../../_metronic/helpers'
import {useQueryResponse} from '../../../core/QueryResponseProvider'
import {resetUserPassword, unlockUser} from '../../../../api/_requests'
import {Link} from 'react-router-dom'
import {Prompt} from '../../../../../../_metronic/layout/components/modal/Prompt'
import {OverlayTrigger, Tooltip} from 'react-bootstrap'

type Props = {
  id: ID
  locked: boolean
  name: string
}

const UserActionsCell: FC<Props> = ({id, locked, name}) => {
  const {query} = useQueryResponse()
  const queryClient = useQueryClient()

  useEffect(() => {
    MenuComponent.reinitialization()
  }, [])

  const resetItem = useMutation(
    () =>
      resetUserPassword(id).then((response) => {
        const {resultCode} = response
        if (resultCode === 0) {
          showSuccessMessage('Kullanıcının şifresi resetlendi')
        } else {
          showErrorMessage('İşlem sırasında hata alındı')
        }
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([`${QUERIES.USERS_LIST}-${query}`])
      },
    }
  )

  const unlockItem = useMutation(
    () =>
      unlockUser(id).then((response) => {
        const {resultCode} = response
        if (resultCode === 0) {
          showSuccessMessage('Kullanıcı kilidi başarıyla kaldırıldı')
        } else {
          showErrorMessage('İşlem sırasında hata alındı')
        }
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([`${QUERIES.USERS_LIST}-${query}`])
      },
    }
  )
  const [showReset, setShowReset] = useState(false)
  const [showUnlock, setShowUnlock] = useState(false)

  const handleReset = async () => {
    await resetItem.mutateAsync()
    setShowReset(false)
  }
  const handleUnlock = async () => {
    await unlockItem.mutateAsync()
    setShowUnlock(false)
  }

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

      <OverlayTrigger
        key='pass'
        placement='top'
        overlay={<Tooltip id='tooltip-copy-to-clipboard'>Şifreyi değiştir</Tooltip>}
      >
        <a
          className={clsx('btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1 mb-1')}
          href='#'
          onClick={(e) => {
            e.preventDefault()
            setShowReset(true)
          }}
        >
          <KTIcon iconName='key' className='fs-2' />
        </a>
      </OverlayTrigger>

      {locked && (
        <OverlayTrigger
          key='unlock'
          placement='top'
          overlay={<Tooltip id='tooltip-copy-to-clipboard'>Kilidi kaldır</Tooltip>}
        >
          <a
            className={clsx('btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1 mb-1')}
            href='#'
            onClick={(e) => {
              e.preventDefault()
              setShowUnlock(true)
            }}
          >
            <KTIcon iconName='lock' className='fs-2' />
          </a>
        </OverlayTrigger>
      )}

      <Prompt
        title={'Şifre Resetleme'}
        handleAccept={handleReset}
        modalText={`Kullanıcı ${name} için yeni şifre üretilecek, e-posta ve mobil telefonuna gönderilecektir. Onaylıyor musunuz?`}
        show={showReset}
        setShow={setShowReset}
      />

      <Prompt
        title={'Kullanıcı açma'}
        handleAccept={handleUnlock}
        modalText={`Kullanıcının kilidi kaldırılacaktır. Onaylıyor musunuz?`}
        show={showUnlock}
        setShow={setShowUnlock}
      />
    </div>
  )
}

export {UserActionsCell}
