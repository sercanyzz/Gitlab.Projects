import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import {UsersListWrapper} from './user-list/UsersList'
import {UserFormWrapper} from './form/UserFormWrapper'

const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'Kullanıcı İşlemleri',
    path: '/users',
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

const UsersPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='list'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>Kullanıcı Listesi</PageTitle>
              <UsersListWrapper />
            </>
          }
        />
        <Route
          path='add'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>Kullanıcı Ekle</PageTitle>
              <UserFormWrapper mode='add' />
            </>
          }
        />
        <Route
          path='edit/:userId'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>Kullanıcı Güncelle</PageTitle>
              <UserFormWrapper mode='edit' />
            </>
          }
        />
        <Route
          path='view/:userId'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>Kullanıcı Detayı</PageTitle>
              <UserFormWrapper mode='view' />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/users/list' />} />
    </Routes>
  )
}

export default UsersPage
