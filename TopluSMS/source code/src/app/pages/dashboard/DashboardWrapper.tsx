/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC} from 'react'
import {useIntl} from 'react-intl'
import {PageTitle} from '../../../_metronic/layout/core'
import {StatCard} from './StatCard'
import useAxios from 'axios-hooks'
import {AxiosError} from 'axios'
import {Stats} from '../../modules/api/_models'

const DashboardPage: FC = () => {
  const [{data, loading, error}] = useAxios(
    'https://dashboard-service-x96yz.ondigitalocean.app/dashboard/count',
    {useCache: false}
  )

  const statData = data?.content
  return (
    <>
      {error ? (
        <DashboardError error={error} />
      ) : (
        <StatsWrapper stats={statData} loading={loading}></StatsWrapper>
      )}
    </>
  )
}

const DashboardWrapper: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.DASHBOARD'})}</PageTitle>
      <DashboardPage />
    </>
  )
}

type ErrorProps = {
  error?: AxiosError<any, any>
}

const DashboardError: FC<ErrorProps> = ({error}) => {
  return (
    <div className='alert alert-dismissible bg-danger d-flex flex-column flex-sm-row p-5 mb-10'>
      <i className='las la-exclamation-triangle'></i>
      <div className='d-flex flex-column text-light pe-0 pe-sm-10'>
        <h5 className='mb-1'>Hata</h5>
        <span>Dashboard bilgilerini çekerken hatayla karşılaşıldı!</span>
      </div>
    </div>
  )
}

type StatsProps = {
  stats?: Stats
  loading: boolean
}

const StatsWrapper: FC<StatsProps> = ({stats, loading}) => {
  return (
    <div className='row g-5 g-xl-10 mb-5 mb-xl-10'>
      <StatCard
        title='Toplam Firma'
        showIcon={true}
        icon='building'
        activeStats={stats?.activeCompanies}
        deactiveStats={stats?.deActiveCompanies}
        loading={loading}
        link='/companies/list'
      />
      <StatCard
        title='Sms Başlığı'
        showIcon={true}
        icon='sms'
        activeStats={stats?.activeSmsHeaders}
        deactiveStats={stats?.deActiveSmsHeaders}
        loading={loading}
        link='/sms-headers/list'
      />
      <StatCard
        title='Kullanıcı'
        showIcon={true}
        icon='user-circle'
        activeStats={stats?.activeUsers}
        deactiveStats={stats?.deActiveUsers}
        loading={loading}
        link='/users/list'
      />
      <StatCard
        title='İş Ortağı'
        showIcon={true}
        icon='users'
        activeStats={stats?.activePartners}
        deactiveStats={stats?.deActivePartners}
        loading={loading}
        link='/companies/list'
      />
    </div>
  )
}

export {DashboardWrapper}
