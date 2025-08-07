import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Body, H1 } from '../../src/components/ui/Typography';
import { colors, spacing } from '../../src/constants/theme';
import { AuthButton } from '../../src/features/auth/components/AuthButton';
import { AuthInput } from '../../src/features/auth/components/AuthInput';
import useGoogleAuth from '../../src/features/auth/hooks/useGoogleAuth';
import { useLogin } from '../../src/features/auth/hooks/useLogin';

const Login = () => {
  const { t } = useTranslation();
  const { form, errors, loading, updateForm, handleLogin } = useLogin();
  const { login: handleGoogleLogin, isLoading: googleLoading } = useGoogleAuth();

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleSubmit = async () => {
    try {
      await handleLogin();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleGooglePress = async () => {
    try {
      await handleGoogleLogin();
    } catch (error) {
      console.error('Google login error:', error);
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
            <View style={styles.header}>
              <H1>{t('auth.login.title')}</H1>
              <Body style={styles.subtitle}>{t('auth.login.subtitle')}</Body>
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

              <AuthInput
                icon="lock-closed-outline"
                placeholder={t('auth.fields.password')}
                isPassword
                value={form.password}
                onChangeText={(text) => updateForm('password', text)}
                error={errors.password}
              />

              <Link href="/forgot-password" asChild>
                <TouchableOpacity style={styles.forgotPassword}>
                  <Body style={styles.forgotPasswordText}>
                    {t('auth.login.forgotPassword')}
                  </Body>
                </TouchableOpacity>
              </Link>

              <AuthButton
                title={t('auth.login.submit')}
                onPress={handleSubmit}
                loading={loading}
              />

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Body style={styles.dividerText}>{t('auth.login.or')}</Body>
                <View style={styles.dividerLine} />
              </View>

              <AuthButton
                title={t('auth.login.googleSignIn')}
                onPress={handleGooglePress}
                loading={googleLoading}
                variant="secondary"
                icon={<Ionicons name="logo-google" size={20} color={colors.textPrimary} />}
              />

              <View style={styles.registerContainer}>
                <Body>{t('auth.login.noAccount')} </Body>
                <Link href="/register" asChild>
                  <TouchableOpacity>
                    <Body style={styles.registerText}>
                      {t('auth.login.register')}
                    </Body>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;

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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
  },
  forgotPasswordText: {
    color: colors.primary,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    color: colors.textSecondary,
    marginHorizontal: spacing.md,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  registerText: {
    color: colors.primary,
  },
}); 