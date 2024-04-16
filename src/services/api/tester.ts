import { axiosInstance } from '@/libs/axios'

const resourceUrl = '/tester'

const getTesterList = () => {
  return axiosInstance({
    method: 'get',
    url: `${resourceUrl}/list`,
  })
}

/**
 * VueQuery
 */

export const useTesterList = () =>
  useQuery({
    queryKey: ['tester', 'list'],
    queryFn: getTesterList,
  })
