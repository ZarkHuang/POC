/* eslint-disable no-useless-catch */
import axios from 'axios'
import { LOCAL_STORAGE_NAME } from '@/utils/config/keys'

const X_AUTHY_API_KEY = import.meta.env.VITE_APP_HOST_API_KEY
const baseURL = `${import.meta.env.VITE_APP_HOST_API_URL}/v1`

export const axiosInstance = axios.create({
  baseURL,
})

axiosInstance.interceptors.request.use(
  (config) => {
    const localStorageState = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_NAME) ?? '{}',
    )
    config.headers.Authorization = `Bearer ${localStorageState.token}`
    config.headers['X-Authy-API-Key'] = X_AUTHY_API_KEY
    return config
  },
  (error) => {
    console.log('[axios request] error: ', error)

    return Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  (response) => {
    console.log('[axios response] response: ', response)

    return response.data.data
  },
  (error) => {
    console.log('[axios response] error: ', error)

    return Promise.reject(error)
  },
)
