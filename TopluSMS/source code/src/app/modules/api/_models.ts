import {ID, ListResponse, Response} from '../../../_metronic/helpers'

export type User = {
  id?: ID
  isTTEmployee?: boolean
  username?: string // max 10 char
  nameSurname?: string // max 30 char
  phone?: string //905xxxxxxxxx
  companyName?: string
  companyCdr?: string //xxxxxxxxx phone without 905
  email?: string // max 55 char
  role?: string //report_user, customer, cc_user, business_user
  companyId?: string
  status?: boolean
  locked?: boolean
  activation_date?: string
  deactivation_date?: string
}

export type BusinessPartner = {
  id?: ID
  commercialName?: string // max 10 char}
}

export type Option = {
  value?: string
  label?: string
}

export type Search = {
  value?: string
}
export type UsersQueryResponse = ListResponse<Array<User>>
export type CompanyQueryResponse = ListResponse<Array<Company>>
export type BPQueryResponse = Response<Array<BusinessPartner>>

export type OperationResponse = {
  data: User
  result: string
}

export type UniqueResponse = {
  unique: boolean
}

export const initialUser: User = {
  username: '',
  nameSurname: '',
  phone: '',
  email: '',
  role: '',
  companyCdr: '',
  companyName: '',
  companyId: '',
  status: false,
  isTTEmployee: false,
  locked: false,
  activation_date: '',
  deactivation_date: '',
}

/* SMS HEADER START */

export type SmsHeader = {
  id?: ID
  smsTitle?: string // max 10 char
  cdr?: string //xxxxxxxxx phone without 905
  companyId?: string
  companyCdr?: string
  companyName?: string
  status?: boolean
  ip?: string
  activation_date?: string
  deactivation_date?: string
}

export type SmsHeadersQueryResponse = ListResponse<Array<SmsHeader>>

export type SmsHeaderOperationResponse = {
  content: ResponseResult
}
export type ResponseResult = {
  message?: string
  id?: string
}

export const initialSmsHeader: SmsHeader = {
  smsTitle: '',
  cdr: '',
  ip: '',
  companyId: '',
  companyName: '',
  status: false,
  activation_date: '',
  deactivation_date: '',
}

/* SMS HEADER END */

/* COMPANY START */
export type Company = {
  id?: ID
  firm?: string // max 40 char
  firmAddress?: string // max 100 char
  contactPerson?: string // max 30 char
  contactPhone?: string // 12 char phone, 90xxxxxxxxxx
  email?: string // max 40 char
  chargedNumber?: string //xxxxxxxxx phone without 905
  vknNo?: string // pattern check
  businessPartner?: string // max 40 char
  useType?: string // max 40 char
  smsType?: string // max 40 char
  smsLimit?: number // max 40 char
  expireDate?: string // max 40 char

  isBrandCode?: boolean
  isAbroadSms?: boolean
  isAbroadSmsWithHeader?: boolean
  isFlashSms?: boolean
  isFtpSms?: boolean
  isKktcSms?: boolean
  isNllsSms?: boolean
  isNormalSms?: boolean
  isOnnetSms?: boolean
  isReportSmsContent?: boolean
  isUnicodeSms?: boolean
  isWapPushSms?: boolean
  sendHourStart?: string // max 40 char
  sendHourFinish?: string // max 40 char
  status?: boolean
}

export type CompanysQueryResponse = ListResponse<Array<Company>>

/* COMPANY END */

/* DASHBOARD START */
export type Stats = {
  activeCompanies?: number
  deActiveCompanies?: number
  activeSmsHeaders?: number
  deActiveSmsHeaders?: number
  activeUsers?: number
  deActiveUsers?: number
  activePartners?: number
  deActivePartners?: number
}

export type StatsResponse = {
  data: Stats
  result: string
}

/* DASHBOARD END */
