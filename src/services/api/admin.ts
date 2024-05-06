import { axiosInstance } from '@/libs/axios'

const resourceUrl = '/admin'

type AdminLoginType = {
  acc: string
  pwd: string
}

const postLogin = ({ data }: { data: AdminLoginType }): Promise<any> => {
  return axiosInstance({
    method: 'post',
    url: `${resourceUrl}/login`,
    data,
  })
}

/**
 * VueQuery
 */
export const useAdminLogin = () =>
  useMutation({
    mutationKey: ['login'],
    mutationFn: postLogin,
  })
