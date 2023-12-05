import {KTIcon} from './KTIcon'
type Props = {
  text?: string
}
export const Warning: React.FC<Props> = ({text}) => {
  return (
    <div className='notice d-flex bg-light-warning rounded border-warning border border-dashed p-6 mb-10'>
      <KTIcon iconName='information-5' className='fs-2tx text-warning me-4' />
      <div className='d-flex flex-stack flex-grow-1'>
        <div className='fw-bold'>
          <h4 className='text-gray-800 fw-bolder'>Dikkat!</h4>
          <div className='fs-6 text-gray-600'>{text}</div>
        </div>
      </div>
    </div>
  )
}
