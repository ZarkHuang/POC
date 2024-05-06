import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_HOST_API_URL,
  headers: {
    'X-Authy-API-Key': import.meta.env.VITE_APP_HOST_API_KEY,
  },
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
