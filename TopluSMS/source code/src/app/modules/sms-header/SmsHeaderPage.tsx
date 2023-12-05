import {Navigate, Routes, Route, Outlet} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import {SmsHeadersFormWrapper} from './form/SmsHeadersFormWrapper'
import {SmsHeadersListWrapper} from './sms-headers-list/SmsHeaderList'

const smsHeadersBreadcrumbs: Array<PageLink> = [
  {
    title: 'Sms Başlığı İşlemleri',
    path: '/sms-headers',
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
              <PageTitle breadcrumbs={smsHeadersBreadcrumbs}>Sms Başlığı Listesi</PageTitle>
              <SmsHeadersListWrapper />
            </>
          }
        />
        <Route
          path='add'
          element={
            <>
              <PageTitle breadcrumbs={smsHeadersBreadcrumbs}>Sms Başlığı Ekle</PageTitle>
              <SmsHeadersFormWrapper mode='add' />
            </>
          }
        />
        <Route
          path='edit/:smsHeaderId'
          element={
            <>
              <PageTitle breadcrumbs={smsHeadersBreadcrumbs}>Sms Başlığı Güncelle</PageTitle>
              <SmsHeadersFormWrapper mode='edit' />
            </>
          }
        />
        <Route
          path='view/:smsHeaderId'
          element={
            <>
              <PageTitle breadcrumbs={smsHeadersBreadcrumbs}>Sms Başlığı Detayı</PageTitle>
              <SmsHeadersFormWrapper mode='view' />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/sms-headers/list' />} />
    </Routes>
  )
}

export default SmsPage
