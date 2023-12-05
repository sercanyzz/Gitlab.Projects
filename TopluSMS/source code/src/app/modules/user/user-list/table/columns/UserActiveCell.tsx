import {FC} from 'react'

type Props = {
  status?: string
}

const UserActiveCell: FC<Props> = ({status}) => {
  return (
    <>
      {status ? (
        <span className='badge badge-light-success fs-8 fw-bold my-2'>Aktif</span>
      ) : (
        <span className='badge badge-light-danger fs-8 fw-bold my-2'>Deaktif</span>
      )}
    </>
  )
}

export {UserActiveCell}
