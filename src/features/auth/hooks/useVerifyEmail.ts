import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../context/ToastContext';
import { useAuthService } from '../services/authService';

interface VerifyEmailState {
  email: string;
  otp: string;
}

interface VerifyEmailErrors {
  email?: string;
  otp?: string;
}

export const useVerifyEmail = (initialEmail?: string) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { verifyEmail } = useAuthService();
  
  const [form, setForm] = useState<VerifyEmailState>({
    email: initialEmail || '',
    otp: '',
  });
  
  const [errors, setErrors] = useState<VerifyEmailErrors>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: VerifyEmailErrors = {};

    if (!form.email) {
      newErrors.email = t('auth.errors.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = t('auth.errors.emailInvalid');
    }

    if (!form.otp) {
      newErrors.otp = t('auth.errors.otpRequired');
    } else if (form.otp.length !== 6 || !/^\d+$/.test(form.otp)) {
      newErrors.otp = t('auth.errors.otpInvalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await verifyEmail({
        email: form.email,
        otp: form.otp,
      });
      showToast(t('auth.messages.verifyEmailSuccess'), 'success');
      router.replace('/login');
    } catch (error: any) {
      console.error('Email verification error:', error);
      
      // Handle specific error cases
      const errorMessage = error.response?.data?.message?.toLowerCase() || '';
      
      if (errorMessage.includes('expired')) {
        showToast(t('auth.messages.otpExpired'), 'error');
      } else if (errorMessage.includes('already used') || errorMessage.includes('already verified')) {
        showToast(t('auth.messages.otpAlreadyUsed'), 'error');
      } else if (errorMessage.includes('invalid') || errorMessage.includes('incorrect')) {
        showToast(t('auth.messages.otpInvalid'), 'error');
      } else {
        showToast(error.message || t('auth.messages.verifyEmailError'), 'error');
      }

      // Set field-specific error if needed
      if (errorMessage.includes('otp') || errorMessage.includes('code') || errorMessage.includes('verification')) {
        setErrors(prev => ({
          ...prev,
          otp: t('auth.errors.otpInvalid')
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (field: keyof VerifyEmailState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (field in errors) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return {
    form,
    errors,
    loading,
    handleSubmit,
    updateForm,
  };
};
