import {SmsHeadersListToolbar} from './SmsHeadersListToolbar'
import {SmsHeadersListSearchComponent} from './SmsHeadersListSearchComponent'

export const SmsHeadersListHeader = () => {
  return (
    <div className='card-header border-0 pt-6'>
      <SmsHeadersListSearchComponent />
      {/* begin::Card toolbar */}
      <div className='card-toolbar'>
        {/* begin::Group actions */}
        {<SmsHeadersListToolbar />}
        {/* end::Group actions */}
      </div>
      {/* end::Card toolbar */}
    </div>
  )
}
