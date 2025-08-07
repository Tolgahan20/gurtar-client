import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../context/ToastContext';
import { LoginDto } from '../../../types/api';
import { useAuth } from '../context/AuthContext';
import { useAuthService } from '../services/authService';

// Initialize Google Sign In
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
});

export const useLogin = () => {
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const { showToast } = useToast();
  const { login, isLoading } = useAuthService();
  const [form, setForm] = useState<LoginDto>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<keyof LoginDto, string | undefined>>({
    email: undefined,
    password: undefined,
  });

  const validateForm = (): boolean => {
    const newErrors: Record<keyof LoginDto, string | undefined> = {
      email: undefined,
      password: undefined,
    };

    if (!form.email) {
      newErrors.email = t('auth.errors.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = t('auth.errors.emailInvalid');
    }

    if (!form.password) {
      newErrors.password = t('auth.errors.passwordRequired');
    } else if (form.password.length < 6) {
      newErrors.password = t('auth.errors.passwordTooShort');
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      const response = await login(form);
      await signIn(response.data.access_token);
      showToast('auth.messages.loginSuccess', 'success');
    } catch (error) {
      console.error('Login error:', error);
      showToast('auth.messages.loginError', 'error');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices();
      
      // Sign in and get tokens in one step
      await GoogleSignin.signIn();
      const { accessToken, idToken } = await GoogleSignin.getTokens();

      if (!idToken) {
        throw new Error('No ID token present');
      }

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken, accessToken);

      // Sign-in the user with the credential
      const userCredential = await auth().signInWithCredential(googleCredential);
      
      // Get the user's Firebase token
      const token = await userCredential.user.getIdToken();
      await signIn(token);
      
      showToast('auth.messages.googleLoginSuccess', 'success');
    } catch (error) {
      console.error('Google login error:', error);
      showToast('auth.messages.googleLoginError', 'error');
    }
  };

  const updateForm = (field: keyof LoginDto, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return {
    form,
    errors,
    loading: isLoading,
    updateForm,
    handleLogin,
    handleGoogleLogin,
  };
}; 