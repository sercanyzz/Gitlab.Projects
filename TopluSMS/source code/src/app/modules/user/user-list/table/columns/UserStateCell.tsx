import {FC} from 'react'
import {KTIcon} from '../../../../../../_metronic/helpers'

type Props = {
  state?: string
}

const UserStateCell: FC<Props> = ({state}) => {
  return <>{state && <KTIcon iconName='check-square' className='fs-2 text-success' />}</>
}

export {UserStateCell}
