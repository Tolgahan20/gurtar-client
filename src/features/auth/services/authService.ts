import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Platform } from 'react-native';
import { AUTH_ENDPOINTS } from '../../../constants/endpoints';
import { AUTH_MESSAGES } from '../../../constants/messages';
import { axiosInstance } from '../../../lib/axios';
import { auth } from '../../../lib/firebase';
import type {
    ApiResponse,
    AuthResponse,
    ForgotPasswordDto,
    LoginDto,
    RefreshTokenDto,
    RegisterDto,
    ResetPasswordDto,
    TokenResponse,
    VerifyEmailDto,
    VerifyOtpDto
} from '../../../types/api';

export const useAuthService = () => {
  const queryClient = useQueryClient();

  // Firebase Authentication Methods
  const firebaseLoginMutation = useMutation<void, Error, LoginDto>({
    mutationFn: async (data) => {
      try {
        const userCredential = await auth().signInWithEmailAndPassword(
          data.email,
          data.password
        );
        const token = await userCredential.user.getIdToken();
        await AsyncStorage.setItem('firebase_token', token);
      } catch (error: any) {
        console.error('Firebase login error:', error);
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          throw new Error('Invalid email or password');
        }
        throw new Error('Firebase login failed. Please try again.');
      }
    }
  });

  const firebaseRegisterMutation = useMutation<void, Error, RegisterDto>({
    mutationFn: async (data) => {
      try {
        const userCredential = await auth().createUserWithEmailAndPassword(
          data.email,
          data.password
        );
        
        await userCredential.user.updateProfile({
          displayName: data.full_name
        });

        await userCredential.user.sendEmailVerification();
        const token = await userCredential.user.getIdToken();
        await AsyncStorage.setItem('firebase_token', token);
      } catch (error: any) {
        console.error('Firebase registration error:', error);
        if (error.code === 'auth/email-already-in-use') {
          throw new Error('Email is already registered');
        }
        throw new Error('Firebase registration failed. Please try again.');
      }
    }
  });

  // Original REST API Authentication Methods
  const loginMutation = useMutation<
    ApiResponse<TokenResponse>,
    Error,
    LoginDto
  >({
    mutationFn: async (data) => {
      try {
        const response = await axiosInstance.post<AuthResponse>(
          AUTH_ENDPOINTS.LOGIN,
          data
        );
        
        if (!response.data.access_token || !response.data.refresh_token) {
          throw new Error('Invalid response from server');
        }

        return {
          data: {
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token,
            expires_in: response.data.expires_in,
          },
          message: response.data.message || 'Login successful',
          statusCode: response.status,
        };
      } catch (error: any) {
        console.log('Login error response:', error.response?.data);
        
        const errorMessage = error.response?.data?.message;
        if (errorMessage === 'Email not verified') {
          throw new Error(AUTH_MESSAGES.ERRORS.EMAIL_NOT_VERIFIED);
        }
        if (errorMessage === 'Invalid credentials') {
          throw new Error(AUTH_MESSAGES.ERRORS.LOGIN_FAILED);
        }
        if (error.response?.status === 401) {
          throw new Error(AUTH_MESSAGES.ERRORS.UNAUTHORIZED);
        }
        if (!error.response || error.message === 'Network Error') {
          throw new Error(AUTH_MESSAGES.ERRORS.NETWORK_ERROR);
        }
        
        throw new Error(AUTH_MESSAGES.ERRORS.SERVER_ERROR);
      }
    },
    onSuccess: async (data) => {
      await AsyncStorage.multiSet([
        ['access_token', data.data.access_token],
        ['refresh_token', data.data.refresh_token],
      ]);
    },
  });

  const registerMutation = useMutation<
    ApiResponse<TokenResponse>,
    Error,
    RegisterDto
  >({
    mutationFn: async (data) => {
      try {
        const response = await axiosInstance.post<AuthResponse>(
          AUTH_ENDPOINTS.REGISTER,
          data
        );

        if (!response.data.access_token || !response.data.refresh_token) {
          throw new Error('Invalid response from server');
        }

        return {
          data: {
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token,
            expires_in: response.data.expires_in,
          },
          message: response.data.message || 'Registration successful',
          statusCode: response.status,
        };
      } catch (error: any) {
        if (Array.isArray(error.response?.data?.message)) {
          throw new Error(error.response.data.message.join(', '));
        }
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
        throw new Error(AUTH_MESSAGES.ERRORS.REGISTER_FAILED);
      }
    },
    onSuccess: async (data) => {
      await AsyncStorage.multiSet([
        ['access_token', data.data.access_token],
        ['refresh_token', data.data.refresh_token],
      ]);
    },
  });

  const googleLoginMutation = useMutation<
    ApiResponse<TokenResponse>,
    Error,
    string
  >({
    mutationFn: async (idToken) => {
      try {
        const response = await axiosInstance.post<AuthResponse>(
          AUTH_ENDPOINTS.GOOGLE_MOBILE,
          {
            idToken,
            platform: Platform.OS as 'ios' | 'android'
          }
        );
        return {
          data: {
            access_token: response.data.access_token!,
            refresh_token: response.data.refresh_token!,
            expires_in: response.data.expires_in || 0,
          },
          message: response.data.message || 'Google login successful',
          statusCode: response.status,
        };
      } catch (error: any) {
        console.log('Google login error:', error.response?.data);
        throw new Error(error.response?.data?.message || 'Google login failed');
      }
    },
    onSuccess: async (data) => {
      await AsyncStorage.multiSet([
        ['access_token', data.data.access_token],
        ['refresh_token', data.data.refresh_token],
      ]);
    },
  });

  const logoutMutation = useMutation<void, Error>({
    mutationFn: async () => {
      try {
        await axiosInstance.post(AUTH_ENDPOINTS.LOGOUT);
        await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'firebase_token']);
        // Also sign out from Firebase if logged in
        if (auth().currentUser) {
          await auth().signOut();
        }
      } catch (error: any) {
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
        throw error;
      }
    },
  });

  const refreshTokenMutation = useMutation<
    ApiResponse<TokenResponse>,
    Error,
    RefreshTokenDto
  >({
    mutationFn: async (data) => {
      try {
        const response = await axiosInstance.post<AuthResponse>(
          AUTH_ENDPOINTS.REFRESH_TOKEN,
          data
        );

        if (!response.data.access_token || !response.data.refresh_token) {
          throw new Error('Invalid response from server');
        }

        return {
          data: {
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token,
            expires_in: response.data.expires_in,
          },
          message: response.data.message || 'Token refreshed successfully',
          statusCode: response.status,
        };
      } catch (error: any) {
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
        throw new Error(AUTH_MESSAGES.ERRORS.REFRESH_TOKEN_FAILED);
      }
    },
    onSuccess: async (data) => {
      await AsyncStorage.multiSet([
        ['access_token', data.data.access_token],
        ['refresh_token', data.data.refresh_token],
      ]);
    },
  });

  const verifyOtpMutation = useMutation<void, Error, VerifyOtpDto>({
    mutationFn: async (data) => {
      try {
        await axiosInstance.post(AUTH_ENDPOINTS.VERIFY_OTP, data);
      } catch (error: any) {
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
        throw new Error(AUTH_MESSAGES.ERRORS.OTP_VERIFY_FAILED);
      }
    },
  });

  const resetPasswordMutation = useMutation<void, Error, ResetPasswordDto>({
    mutationFn: async (data) => {
      try {
        await axiosInstance.post(AUTH_ENDPOINTS.RESET_PASSWORD, data);
      } catch (error: any) {
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
        throw new Error(AUTH_MESSAGES.ERRORS.PASSWORD_RESET_FAILED);
      }
    },
  });

  const verifyEmailMutation = useMutation<void, Error, VerifyEmailDto>({
    mutationFn: async (data) => {
      try {
        await axiosInstance.post(AUTH_ENDPOINTS.VERIFY_EMAIL, data);
      } catch (error: any) {
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
        throw new Error(AUTH_MESSAGES.ERRORS.VERIFY_EMAIL_FAILED);
      }
    },
  });

  const forgotPasswordMutation = useMutation<void, Error, ForgotPasswordDto>({
    mutationFn: async (data) => {
      try {
        await axiosInstance.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, data);
      } catch (error: any) {
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
        throw new Error(AUTH_MESSAGES.ERRORS.PASSWORD_RESET_FAILED);
      }
    },
  });

  return {
    // Firebase methods
    firebaseLogin: firebaseLoginMutation.mutateAsync,
    firebaseRegister: firebaseRegisterMutation.mutateAsync,
    
    // Original REST API methods
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    googleLogin: googleLoginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    refreshToken: refreshTokenMutation.mutateAsync,
    forgotPassword: forgotPasswordMutation.mutateAsync,
    verifyOtp: verifyOtpMutation.mutateAsync,
    resetPassword: resetPasswordMutation.mutateAsync,
    verifyEmail: verifyEmailMutation.mutateAsync,
    isLoading: 
      loginMutation.isPending || 
      registerMutation.isPending || 
      googleLoginMutation.isPending || 
      logoutMutation.isPending || 
      refreshTokenMutation.isPending ||
      forgotPasswordMutation.isPending ||
      verifyOtpMutation.isPending ||
      resetPasswordMutation.isPending ||
      verifyEmailMutation.isPending ||
      firebaseLoginMutation.isPending ||
      firebaseRegisterMutation.isPending,
  };
}; 