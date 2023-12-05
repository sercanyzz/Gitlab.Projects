import {Navigate, Routes, Route, Outlet} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import {CompaniesFormWrapper} from './form/CompaniesFormWrapper'
import {CompaniesListWrapper} from './companies-list/CompaniesList'

const companiesBreadcrumbs: Array<PageLink> = [
  {
    title: 'Firma İşlemleri',
    path: '/companies',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

const SmsPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='list'
          element={
            <>
              <PageTitle breadcrumbs={companiesBreadcrumbs}>Firma Listesi</PageTitle>
              <CompaniesListWrapper />
            </>
          }
        />
        <Route
          path='add'
          element={
            <>
              <PageTitle breadcrumbs={companiesBreadcrumbs}>Firma Ekle</PageTitle>
              <CompaniesFormWrapper mode='add' />
            </>
          }
        />
        <Route
          path='edit/:companyId'
          element={
            <>
              <PageTitle breadcrumbs={companiesBreadcrumbs}>Firma Güncelle</PageTitle>
              <CompaniesFormWrapper mode='edit' />
            </>
          }
        />
        <Route
          path='view/:companyId'
          element={
            <>
              <PageTitle breadcrumbs={companiesBreadcrumbs}>Firma Detayı</PageTitle>
              <CompaniesFormWrapper mode='view' />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/companies/list' />} />
    </Routes>
  )
}

export default SmsPage
