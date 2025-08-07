import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Body, H1 } from '../../src/components/ui/Typography';
import { colors, spacing } from '../../src/constants/theme';
import { AuthButton } from '../../src/features/auth/components/AuthButton';
import { AuthInput } from '../../src/features/auth/components/AuthInput';
import useGoogleAuth from '../../src/features/auth/hooks/useGoogleAuth';
import { useRegister } from '../../src/features/auth/hooks/useRegister';

const Register = () => {
  const { t } = useTranslation();
  const { form, errors, loading, updateForm, handleRegister } = useRegister();
  const { login: handleGoogleLogin, isLoading: googleLoading } = useGoogleAuth();

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleSubmit = async () => {
    try {
      await handleRegister();
    } catch (error) {
      console.error('Register error:', error);
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
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={styles.container}>
              <View style={styles.header}>
                <H1>{t('auth.register.title')}</H1>
                <Body style={styles.subtitle}>{t('auth.register.subtitle')}</Body>
              </View>

              <View style={styles.form}>
                <AuthInput
                  icon="person-outline"
                  placeholder={t('auth.fields.fullName')}
                  autoCapitalize="words"
                  value={form.full_name}
                  onChangeText={(text) => updateForm('full_name', text)}
                  error={errors.full_name}
                />

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
                  icon="call-outline"
                  placeholder={t('auth.fields.phoneNumber')}
                  keyboardType="phone-pad"
                  value={form.phone_number}
                  onChangeText={(text) => updateForm('phone_number', text)}
                  error={errors.phone_number}
                />

                <AuthInput
                  icon="lock-closed-outline"
                  placeholder={t('auth.fields.password')}
                  isPassword
                  value={form.password}
                  onChangeText={(text) => updateForm('password', text)}
                  error={errors.password}
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
                  title={t('auth.register.submit')}
                  onPress={handleSubmit}
                  loading={loading}
                />

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Body style={styles.dividerText}>{t('auth.register.or')}</Body>
                  <View style={styles.dividerLine} />
                </View>

                <AuthButton
                  title={t('auth.register.googleSignUp')}
                  onPress={handleGooglePress}
                  loading={googleLoading}
                  variant="secondary"
                  icon={<Ionicons name="logo-google" size={20} color={colors.textPrimary} />}
                />

                <View style={styles.loginContainer}>
                  <Body>{t('auth.register.haveAccount')} </Body>
                  <Link href="/login" asChild>
                    <TouchableOpacity>
                      <Body style={styles.loginText}>
                        {t('auth.register.login')}
                      </Body>
                    </TouchableOpacity>
                  </Link>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  loginText: {
    color: colors.primary,
  },
}); 