import { axiosInstance } from '@/libs/axios'

export const fetchUserImages = async (token: string): Promise<any> => {
  try {
    const response = await axiosInstance.get('/admin/user/images', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data.data
  } catch (error) {
    throw new Error('無法獲取圖像數據')
  }
}
