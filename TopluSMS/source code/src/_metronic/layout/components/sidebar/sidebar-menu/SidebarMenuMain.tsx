/* eslint-disable react/jsx-no-target-blank */
import {SidebarMenuItem} from './SidebarMenuItem'

const SidebarMenuMain = () => {
  return (
    <>
      <SidebarMenuItem to='/dashboard' icon='element-11' title='Anasayfa' />
      <SidebarMenuItem to='/companies/list' icon='message-text-2' title='Firmaları Listele' />
      <SidebarMenuItem to='/sms-headers/list' icon='sms' title='SMS Başlıklarını Listele' />
      <SidebarMenuItem
        to='/users/list'
        fontIcon='bi-sticky'
        icon='chart-simple'
        title='Kullanıcı Listesi'
      />
    </>
  )
}

export {SidebarMenuMain}
