import {CompaniesListToolbar} from './CompaniesListToolbar'
import {CompaniesListSearchComponent} from './CompaniesListSearchComponent'

export const CompaniesListHeader = () => {
  return (
    <div className='card-header border-0 pt-6'>
      <CompaniesListSearchComponent />
      {/* begin::Card toolbar */}
      <div className='card-toolbar'>
        {/* begin::Group actions */}
        {<CompaniesListToolbar />}
        {/* end::Group actions */}
      </div>
      {/* end::Card toolbar */}
    </div>
  )
}
