import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Get the API URL based on the environment
const getBaseURL = () => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
  const baseUrl = `${apiUrl}/api/v1`;
  
  if (__DEV__) {
    // In development, if running on a physical device, replace localhost/127.0.0.1 with your machine's IP
    if (Platform.OS !== 'web' && (apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1'))) {
      return baseUrl.replace('localhost', '172.20.10.2')
                   .replace('127.0.0.1', '172.20.10.2');
    }
  }
  
  return baseUrl;
};

export const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Add additional headers for development on physical devices
      if (__DEV__ && Platform.OS !== 'web') {
        config.headers['Accept-Encoding'] = 'gzip, deflate';
        config.headers['Accept'] = 'application/json';
        // Add the Expo client version
        if (Constants.expoConfig?.version) {
          config.headers['X-Expo-Client-Version'] = Constants.expoConfig.version;
        }
      }

      // Log request in development
      if (__DEV__) {
        console.log('API Request:', {
          method: config.method,
          url: config.url,
          data: config.data,
          headers: config.headers,
          baseURL: config.baseURL,
        });
      }
    } catch (error) {
      console.error('Error reading token:', error);
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    // Log response in development
    if (__DEV__) {
      console.log('API Response:', {
        status: response.status,
        data: response.data,
        headers: response.headers,
      });
    }
    return response;
  },
  async (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error.message);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    const originalRequest = error.config;

    // Log error in development
    if (__DEV__) {
      console.error('API Error:', {
        url: originalRequest?.url,
        method: originalRequest?.method,
        status: error.response?.status,
        data: error.response?.data,
        headers: originalRequest?.headers,
        message: error.message,
      });
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axiosInstance.post(`/auth/refresh-token`, {
          refresh_token: refreshToken,
        });

        const { access_token } = response.data;
        await AsyncStorage.setItem('access_token', access_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Handle refresh token failure (e.g., logout user)
        await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
        throw refreshError;
      }
    }

    // Return the original error response
    return Promise.reject(error);
  }
);

export default axiosInstance; 