import { axiosInstance } from '@/libs/axios'

export const fetchUserImages = async (): Promise<any> => {
    try {
      const response = await axiosInstance.get('/admin/user/images');
      // console.log("API Response:", response);
      return response;
    } catch (error) {
      console.error('Error fetching images:', error);
      throw error;
    }
  };

  export const recognizeImage = async (imageId: string): Promise<any> => {
    try {
        const response = await axiosInstance.post(`/images/${imageId}/ai`);
        console.log("Recognition API Response:", response);
        return response;
    } catch (error) {
        console.error('Error during image recognition:', error);
        throw error;
    }
};


export const submitImageLabels = async (imageId: any, labelData: { label_data: any[]; }) => {
  try {
    const response = await axiosInstance.post(`/images/${imageId}/label`, labelData);
    console.log("Label Submission Response:", response);
    return response;
  } catch (error) {
    console.error('Error during label submission:', error);
    throw error;
  }
};