import {FC} from 'react'

type Props = {
  active?: string
}

const StateCell: FC<Props> = ({active}) => {
  return (
    <>
      {active ? (
        <span className='badge badge-light-success fs-8 fw-bold my-2'>Aktif</span>
      ) : (
        <span className='badge badge-light-danger fs-8 fw-bold my-2'>Deaktif</span>
      )}
    </>
  )
}

export {StateCell}
