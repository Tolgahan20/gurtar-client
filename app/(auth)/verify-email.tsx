import { Link, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Body, H1 } from '../../src/components/ui/Typography';
import { spacing } from '../../src/constants/theme';
import { AuthButton } from '../../src/features/auth/components/AuthButton';
import { AuthInput } from '../../src/features/auth/components/AuthInput';
import { OTPInput } from '../../src/features/auth/components/OTPInput';
import { useVerifyEmail } from '../../src/features/auth/hooks/useVerifyEmail';

export default function VerifyEmail() {
  const { t } = useTranslation();
  const { email } = useLocalSearchParams<{ email: string }>();
  const { form, errors, loading, handleSubmit, updateForm } = useVerifyEmail(email);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <H1>{t('auth.verifyEmail.title')}</H1>
        <Body style={styles.subtitle}>{t('auth.verifyEmail.subtitle')}</Body>
      </View>

      <View style={styles.form}>
        <AuthInput
          icon="mail-outline"
          placeholder={t('auth.fields.email')}
          value={form.email}
          onChangeText={(text) => updateForm('email', text)}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!email} // Make email field readonly if provided via params
        />

        <OTPInput
          value={form.otp}
          onChange={(text) => updateForm('otp', text)}
          error={errors.otp}
        />

        <AuthButton
          title={t('auth.verifyEmail.submit')}
          onPress={handleSubmit}
          loading={loading}
        />

        <Link href="/login" asChild>
          <TouchableOpacity style={styles.backButton}>
            <Body style={styles.backButtonText}>
              {t('auth.verifyEmail.backToLogin')}
            </Body>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xl,
    backgroundColor: '#fff',
  },
  header: {
    marginTop: Platform.OS === 'ios' ? spacing.xxl * 3 : spacing.xxl * 2,
    marginBottom: spacing.xl * 2,
  },
  subtitle: {
    marginTop: spacing.md,
    color: '#666',
  },
  form: {
    gap: spacing.xl,
  },
  backButton: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  backButtonText: {
    color: '#666',
  },
});
