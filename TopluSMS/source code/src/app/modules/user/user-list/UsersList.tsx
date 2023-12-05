import {QueryRequestProvider} from '../core/QueryRequestProvider'
import {QueryResponseProvider} from '../core/QueryResponseProvider'
import {UsersListHeader} from '../components/header/UsersListHeader'
import {UsersTable} from './table/UsersTable'
import {KTCard} from '../../../../_metronic/helpers'
import {UsersListFooter} from '../components/header/UsersListFooter'

const UsersList = () => {
  return (
    <>
      <KTCard>
        <UsersListHeader />
        <UsersTable />
        <UsersListFooter />
      </KTCard>
    </>
  )
}

const UsersListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <UsersList />
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {UsersListWrapper}
