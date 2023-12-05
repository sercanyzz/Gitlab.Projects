import {QueryRequestProvider} from '../core/QueryRequestProvider'
import {QueryResponseProvider} from '../core/QueryResponseProvider'
import {CompaniesListHeader} from '../components/header/CompaniesListHeader'
import {CompaniesTable} from './table/CompaniesTable'
import {KTCard} from '../../../../_metronic/helpers'
import {CompaniesListFooter} from '../components/header/CompaniesListFooter'

const CompaniesList = () => {
  return (
    <>
      <KTCard>
        <CompaniesListHeader />
        <CompaniesTable />
        <CompaniesListFooter />
      </KTCard>
    </>
  )
}

const CompaniesListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <CompaniesList />
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {CompaniesListWrapper}
