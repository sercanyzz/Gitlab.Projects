import {FC} from 'react'

type Props = {
  text?: string
}

const UserTextCell: FC<Props> = ({text}) => <span className='text-gray-800'>{text}</span>

export {UserTextCell}
