import { axiosInstance } from '@/libs/axios'

export const fetchUserImages = async (): Promise<any> => {
    try {
      const response = await axiosInstance.get('/admin/user/images');
      console.log("API Response:", response);
      return response;
    } catch (error) {
      console.error('Error fetching images:', error);
      throw error;
    }
  };
  