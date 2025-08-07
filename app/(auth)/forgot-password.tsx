import { Link } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Body, H1 } from '../../src/components/ui/Typography';
import { colors, spacing } from '../../src/constants/theme';
import { AuthButton } from '../../src/features/auth/components/AuthButton';
import { AuthInput } from '../../src/features/auth/components/AuthInput';
import { OTPInput } from '../../src/features/auth/components/OTPInput';
import { useForgotPassword } from '../../src/features/auth/hooks/useForgotPassword';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const { step, form, errors, loading, updateForm, handleSubmit } = useForgotPassword();

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const renderStepContent = () => {
    switch (step) {
      case 'email':
        return (
          <>
            <View style={styles.header}>
              <H1>{t('auth.forgotPassword.title')}</H1>
              <Body style={styles.subtitle}>{t('auth.forgotPassword.subtitle')}</Body>
            </View>

            <View style={styles.form}>
              <AuthInput
                icon="mail-outline"
                placeholder={t('auth.fields.email')}
                keyboardType="email-address"
                autoCapitalize="none"
                value={form.email}
                onChangeText={(text) => updateForm('email', text)}
                error={errors.email}
              />

              <AuthButton
                title={t('auth.forgotPassword.submit')}
                onPress={handleSubmit}
                loading={loading}
              />

              <Link href="/login" asChild>
                <TouchableOpacity style={styles.backButton}>
                  <Body style={styles.backButtonText}>
                    {t('auth.forgotPassword.backToLogin')}
                  </Body>
                </TouchableOpacity>
              </Link>
            </View>
          </>
        );

      case 'otp':
        return (
          <>
            <View style={styles.header}>
              <H1>{t('auth.forgotPassword.otpTitle')}</H1>
              <Body style={styles.subtitle}>{t('auth.forgotPassword.otpSubtitle')}</Body>
            </View>

            <View style={styles.form}>
              <OTPInput
                value={form.otp}
                onChange={(text) => updateForm('otp', text)}
                error={errors.otp}
              />

              <AuthButton
                title={t('auth.forgotPassword.verifyOtp')}
                onPress={handleSubmit}
                loading={loading}
              />
            </View>
          </>
        );

      case 'newPassword':
        return (
          <>
            <View style={styles.header}>
              <H1>{t('auth.forgotPassword.newPasswordTitle')}</H1>
              <Body style={styles.subtitle}>{t('auth.forgotPassword.newPasswordSubtitle')}</Body>
            </View>

            <View style={styles.form}>
              <AuthInput
                icon="lock-closed-outline"
                placeholder={t('auth.fields.newPassword')}
                isPassword
                value={form.newPassword}
                onChangeText={(text) => updateForm('newPassword', text)}
                error={errors.newPassword}
              />

              <AuthInput
                icon="lock-closed-outline"
                placeholder={t('auth.fields.confirmPassword')}
                isPassword
                value={form.confirmPassword}
                onChangeText={(text) => updateForm('confirmPassword', text)}
                error={errors.confirmPassword}
              />

              <AuthButton
                title={t('auth.forgotPassword.resetPassword')}
                onPress={handleSubmit}
                loading={loading}
              />
            </View>
          </>
        );

      case 'success':
        return (
          <>
            <View style={styles.header}>
              <H1>{t('auth.forgotPassword.successTitle')}</H1>
              <Body style={styles.subtitle}>{t('auth.forgotPassword.successMessage')}</Body>
            </View>

            <View style={styles.form}>
              <Link href="/login" asChild>
                <AuthButton
                  title={t('auth.forgotPassword.backToLogin')}
                  onPress={() => {}}
                />
              </Link>
            </View>
          </>
        );

      case 'failure':
        return (
          <>
            <View style={styles.header}>
              <H1>{t('auth.forgotPassword.failureTitle')}</H1>
              <Body style={styles.subtitle}>{t('auth.forgotPassword.failureMessage')}</Body>
            </View>

            <View style={styles.form}>
              <AuthButton
                title={t('auth.forgotPassword.tryAgain')}
                onPress={handleSubmit}
                loading={loading}
              />

              <Link href="/login" asChild>
                <TouchableOpacity style={styles.backButton}>
                  <Body style={styles.backButtonText}>
                    {t('auth.forgotPassword.backToLogin')}
                  </Body>
                </TouchableOpacity>
              </Link>
            </View>
          </>
        );
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <View style={styles.container}>
            {renderStepContent()}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: spacing.xl,
  },
  header: {
    marginTop: Platform.OS === 'ios' ? spacing.xxl * 2 : spacing.xxl,
    marginBottom: spacing.xl,
  },
  subtitle: {
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  form: {
    gap: spacing.md,
  },
  backButton: {
    alignSelf: 'center',
    marginTop: spacing.xl,
  },
  backButtonText: {
    color: colors.primary,
  },
}); 