import {QueryRequestProvider} from '../core/QueryRequestProvider'
import {QueryResponseProvider} from '../core/QueryResponseProvider'
import {SmsHeadersListHeader} from '../components/header/SmsHeadersListHeader'
import {SmsHeadersTable} from './table/SmsHeadersTable'
import {KTCard} from '../../../../_metronic/helpers'
import {SmsHeadersListFooter} from '../components/header/SmsHeaderListFooter'

const SmsHeadersList = () => {
  return (
    <>
      <KTCard>
        <SmsHeadersListHeader />
        <SmsHeadersTable />
        <SmsHeadersListFooter />
      </KTCard>
    </>
  )
}

const SmsHeadersListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <SmsHeadersList />
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {SmsHeadersListWrapper}
