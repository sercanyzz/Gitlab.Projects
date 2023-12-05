import {FC} from 'react'

type Props = {
  text?: string
}

const UseTypeCell: FC<Props> = ({text}) => (
  <span className='text-gray-800'>{text === 'trial' ? 'deneme' : text}</span>
)

export {UseTypeCell}
