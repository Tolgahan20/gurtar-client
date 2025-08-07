import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../../src/constants/theme';
import { AuthButton } from '../../src/features/auth/components/AuthButton';
import { useAuth } from '../../src/features/auth/context/AuthContext';

export default function ProfileScreen() {
  const { signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.buttonContainer}>
        <AuthButton
          title="Sign Out"
          onPress={signOut}
          variant="secondary"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.xl,
  },
  buttonContainer: {
    width: '100%',
    marginTop: spacing.xl,
  },
}); 