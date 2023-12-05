import {useQuery} from 'react-query'
import {isNotEmpty, QUERIES} from '../../../../_metronic/helpers'
import {CompanyForm} from './CompanyForm'
import {useParams} from 'react-router-dom'
import {FC} from 'react'
import {getCompanyById} from '../../api/_requests'

type Props = {
  mode: string
}

export const CompaniesFormWrapper: FC<Props> = ({mode}) => {
  let {companyId} = useParams()
  const enabledQuery: boolean = isNotEmpty(companyId)
  const {
    isLoading,
    data: company,
    error,
  } = useQuery(
    `${QUERIES.COMPANY}-company-${companyId}`,
    () => {
      return getCompanyById(companyId)
    },
    {
      cacheTime: 0,
      enabled: enabledQuery,
      onError: (err) => {
        console.error(err)
      },
    }
  )
  if (!companyId) {
    return <CompanyForm isCompanyLoading={isLoading} mode={mode} company={{id: undefined}} />
  }

  if (!isLoading && !error && company) {
    return <CompanyForm isCompanyLoading={isLoading} mode={mode} company={company} />
  }

  return null
}
