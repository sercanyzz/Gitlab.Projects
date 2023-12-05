import axios, {AxiosResponse} from 'axios'
import {Content, ID, Response} from '../../../_metronic/helpers'
import {
  User,
  UsersQueryResponse,
  OperationResponse,
  CompanyQueryResponse,
  SmsHeader,
  SmsHeadersQueryResponse,
  BPQueryResponse,
  UniqueResponse,
  Company,
  CompanysQueryResponse,
  Search,
} from './_models'

const USERS_URL = `https://user-service-c3h7g.ondigitalocean.app/user`
const USER_CHECK_URL = `https://user-service-c3h7g.ondigitalocean.app/user/unique`
const COMPANY_CHECK_URL = `https://company-service-zqtth.ondigitalocean.app/company/unique`

const COMPANY_SEARCH_URL = `https://company-service-zqtth.ondigitalocean.app/company/search`
const BP_SEARCH_URL = `https://prm-service-nllfi.ondigitalocean.app/prmQuery`

const SMS_HEADERS_URL = `https://header-service-wnq5z.ondigitalocean.app/header`
const HEADER_CHECK_URL = `https://header-service-wnq5z.ondigitalocean.app/header/unique`

export const getUsers = (query: string): Promise<UsersQueryResponse> => {
  return axios.get(`${USERS_URL}?${query}`).then((d: AxiosResponse<UsersQueryResponse>) => d.data)
}

export const getUserById = (id: ID): Promise<User | undefined> => {
  return axios
    .get(`${USERS_URL}/${id}`)
    .then((response: AxiosResponse<Response<User>>) => response.data)
    .then((response: Response<User>) => response.content)
}

export const createUser = (user: User): Promise<Response<User> | undefined> => {
  return axios
    .post(`${USERS_URL}`, user)
    .then((response: AxiosResponse<Response<User>>) => response.data)
}

export const updateUser = (user: User): Promise<Response<User> | undefined> => {
  return axios
    .put(`${USERS_URL}`, user)
    .then((response: AxiosResponse<Response<User>>) => response.data)
}

export const checkCompanyField = (
  field: string,
  value: string,
  dataId: ID = ''
): Promise<boolean | undefined> => {
  return axios
    .post(`${COMPANY_CHECK_URL}`, {field: field, value: value, dataId: dataId})
    .then((response: AxiosResponse<Response<boolean>>) => response.data)
    .then((response: Response<boolean>) => response.content)
}

export const checkUserField = (
  field: string,
  value: string,
  dataId: ID = ''
): Promise<boolean | undefined> => {
  return axios
    .post(`${USER_CHECK_URL}`, {field: field, value: value, dataId: dataId})
    .then((response: AxiosResponse<Response<boolean>>) => response.data)
    .then((response: Response<boolean>) => response.content)
}
export const checkHeaderField = (
  field: string,
  value: string,
  dataId: ID = ''
): Promise<boolean | undefined> => {
  return axios
    .post(`${HEADER_CHECK_URL}`, {field: field, value: value, dataId: dataId})
    .then((response: AxiosResponse<Response<boolean>>) => response.data)
    .then((response: Response<boolean>) => response.content)
}

export const resetUserPassword = (userId: ID): Promise<Response<User>> => {
  return axios
    .post(`${USERS_URL}/resetPassword`, {userId: userId})
    .then((response: AxiosResponse<Response<User>>) => response.data)
}

export const unlockUser = (userId: ID): Promise<Response<User>> => {
  return axios
    .post(`${USERS_URL}/lockStatus`, {id: userId, lockStatus: false})
    .then((response: AxiosResponse<Response<User>>) => response.data)
}

export const getBusinessPartners = (): Promise<BPQueryResponse> => {
  return axios
    .get(`${BP_SEARCH_URL}`)
    .then((response: AxiosResponse<BPQueryResponse>) => response.data)
}
/* SMS HEADERS START */

export const getSmsHeaders = (query: string): Promise<SmsHeadersQueryResponse> => {
  return axios
    .get(`${SMS_HEADERS_URL}?${query}`)
    .then((d: AxiosResponse<SmsHeadersQueryResponse>) => d.data)
}

export const getSmsHeaderById = (id: ID): Promise<SmsHeader | undefined> => {
  return axios
    .get(`${SMS_HEADERS_URL}/${id}`)
    .then((response: AxiosResponse<Response<SmsHeader>>) => response.data)
    .then((response: Response<SmsHeader>) => response.content)
}

export const createSmsHeader = (smsHeader: SmsHeader): Promise<Response<SmsHeader> | undefined> => {
  return axios
    .post(`${SMS_HEADERS_URL}`, smsHeader)
    .then((response: AxiosResponse<Response<SmsHeader>>) => response.data)
}

export const updateSmsHeader = (smsHeader: SmsHeader): Promise<Response<SmsHeader> | undefined> => {
  return axios
    .put(`${SMS_HEADERS_URL}`, smsHeader)
    .then((response: AxiosResponse<Response<SmsHeader>>) => response.data)
}

/* SMS HEADERS END */

/* COMPANIES START */

const COMPANY_URL = `https://company-service-zqtth.ondigitalocean.app/company`

export const searchCompanies = (query: Search): Promise<Response<Array<Company>>> => {
  return axios
    .post(`${COMPANY_SEARCH_URL}`, query)
    .then((response: AxiosResponse<Response<Array<Company>>>) => response.data)
}

export const getCompanies = (query: string): Promise<CompanysQueryResponse> => {
  return axios
    .get(`${COMPANY_URL}?${query}`)
    .then((d: AxiosResponse<CompanysQueryResponse>) => d.data)
}

export const getCompanyById = (id: ID): Promise<Company | undefined> => {
  return axios
    .get(`${COMPANY_URL}/${id}`)
    .then((response: AxiosResponse<Response<Company>>) => response.data)
    .then((data: Response<Company>) => data.content)
}

export const createCompany = (company: Company): Promise<Response<string> | undefined> => {
  return axios
    .post(COMPANY_URL, company)
    .then((response: AxiosResponse<Response<string>>) => response.data)
}

export const updateCompany = (company: Company): Promise<Response<string> | undefined> => {
  return axios
    .put(COMPANY_URL, company)
    .then((response: AxiosResponse<Response<string>>) => response.data)
}

/* COMPANIES END */

axios.interceptors.response.use(
  function (response) {
    // Optional: Do something with response data
    return response
  },
  function (error) {
    // 401 Token expired, refresh to logout
    if (error.response.status === 401) {
      window.location.reload()
    }
    return Promise.reject(error)
  }
)
