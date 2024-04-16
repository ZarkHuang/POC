import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_APP_API_URL

export const axiosInstance = axios.create({
  baseURL: `${apiBaseUrl}`,
})

axiosInstance.interceptors.request.use(
  (config) => {
    console.log('[axios request] config: ', config)

    return config
  },
  (error) => {
    console.log('[axios request] error: ', error)

    return Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  },
)
