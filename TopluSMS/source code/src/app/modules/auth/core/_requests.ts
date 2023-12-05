import axios, {AxiosResponse} from 'axios'
import {AuthModel, UserModel} from './_models'
import {User} from '../../api/_models'
import {Response} from '../../../../_metronic/helpers'

const API_URL = 'https://auth-api-xv9g2.ondigitalocean.app'

export const USER_INFO_URL = `https://user-service-c3h7g.ondigitalocean.app/user/name`
export const VALIDATE_TOKEN = `${API_URL}/token/user`
export const LOGIN_URL = `${API_URL}/login`
export const REGISTER_URL = `${API_URL}/register`
export const REQUEST_PASSWORD_URL = `${API_URL}/forgot_password`

// Server should return AuthModel
export function login(username: string, password: string) {
  return axios.post<AuthModel>(LOGIN_URL, {
    username,
    password,
  })
}

// Server should return AuthModel
export function register(
  email: string,
  firstname: string,
  lastname: string,
  password: string,
  password_confirmation: string
) {
  return axios.post(REGISTER_URL, {
    email,
    first_name: firstname,
    last_name: lastname,
    password,
    password_confirmation,
  })
}

// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(email: string) {
  return axios.post<{result: boolean}>(REQUEST_PASSWORD_URL, {
    email,
  })
}

export function getUserByTokenOld(token: string) {
  return axios.post<UserModel>(VALIDATE_TOKEN, {
    token: token,
  })
}

export function isTokenValid(token: string) {
  return axios
    .post(VALIDATE_TOKEN, {
      token: token,
    })
    .then((response: AxiosResponse<UserModel>) => response.data)
}
export function getUserInfo(username: string) {
  return axios
    .post(USER_INFO_URL, {
      username: username,
    })
    .then((response: AxiosResponse<Response<User>>) => response.data)
    .then((response: Response<User>) => response.content)
}
