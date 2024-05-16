import { axiosInstance } from '@/libs/axios'

//登入
export const fetchUserImages = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get('/admin/user/images')
    // console.log("API Response:", response);
    return response
  } catch (error) {
    console.error('Error fetching images:', error)
    throw error
  }
}

//讀取圖片
export const recognizeImage = async (imageId: string): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/images/${imageId}/ai`)
    console.log('Recognition API Response:', response)
    return response
  } catch (error) {
    console.error('Error during image recognition:', error)
    throw error
  }
}

//提交
export const submitImageLabels = async (
  imageId: any,
  labelData: { label_data: any[] },
) => {
  try {
    const response = await axiosInstance.post(
      `/images/${imageId}/label`,
      labelData,
    )
    console.log('Label Submission Response:', response)
    return response
  } catch (error) {
    console.error('Error during label submission:', error)
    throw error
  }
}

//獲取歷史資料
export const fetchImageLabelHistory = async (imageId: string): Promise<any> => {
  try {
      const response = await axiosInstance.get(`/images/${imageId}/label/history`);
      // console.log("Label History Response:", response);
      return response;
  } catch (error) {
      console.error('Error fetching label history:', error);
      throw error;
  }
};


// 獲取歷史紀錄數據
export const fetchHistoryData = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get('/admin/user/images/labels')
    console.log('API Response:', response)
    return response
  } catch (error) {
    console.error('Error fetching history data:', error)
    throw error
  }
}
