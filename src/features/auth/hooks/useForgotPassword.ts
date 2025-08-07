import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export type ForgotPasswordStep = 'email' | 'otp' | 'newPassword' | 'success' | 'failure';

interface ForgotPasswordState {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

interface ForgotPasswordErrors {
  email?: string;
  otp?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export const useForgotPassword = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState<ForgotPasswordStep>('email');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ForgotPasswordState>({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<ForgotPasswordErrors>({});

  const validateEmail = (): boolean => {
    const newErrors: ForgotPasswordErrors = {};

    if (!form.email) {
      newErrors.email = t('auth.errors.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = t('auth.errors.emailInvalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOTP = (): boolean => {
    const newErrors: ForgotPasswordErrors = {};

    if (!form.otp) {
      newErrors.otp = t('auth.errors.otpRequired');
    } else if (!/^\d{6}$/.test(form.otp)) {
      newErrors.otp = t('auth.errors.otpInvalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateNewPassword = (): boolean => {
    const newErrors: ForgotPasswordErrors = {};

    if (!form.newPassword) {
      newErrors.newPassword = t('auth.errors.passwordRequired');
    } else if (form.newPassword.length < 6) {
      newErrors.newPassword = t('auth.errors.passwordTooShort');
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = t('auth.errors.confirmPasswordRequired');
    } else if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = t('auth.errors.passwordsDontMatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    let isValid = false;

    switch (step) {
      case 'email':
        isValid = validateEmail();
        if (!isValid) return;

        setLoading(true);
        try {
          // TODO: Call API to send OTP
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
          setStep('otp');
        } catch (error) {
          console.error('Send OTP error:', error);
          setStep('failure');
        } finally {
          setLoading(false);
        }
        break;

      case 'otp':
        isValid = validateOTP();
        if (!isValid) return;

        setLoading(true);
        try {
          // TODO: Call API to verify OTP
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
          setStep('newPassword');
        } catch (error) {
          console.error('Verify OTP error:', error);
          setStep('failure');
        } finally {
          setLoading(false);
        }
        break;

      case 'newPassword':
        isValid = validateNewPassword();
        if (!isValid) return;

        setLoading(true);
        try {
          // TODO: Call API to reset password
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
          setStep('success');
        } catch (error) {
          console.error('Reset password error:', error);
          setStep('failure');
        } finally {
          setLoading(false);
        }
        break;

      case 'failure':
        setStep('email');
        setForm({
          email: '',
          otp: '',
          newPassword: '',
          confirmPassword: '',
        });
        setErrors({});
        break;
    }
  };

  const updateForm = (field: keyof ForgotPasswordState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return {
    step,
    form,
    errors,
    loading,
    updateForm,
    handleSubmit,
  };
}; 