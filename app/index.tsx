import { Redirect } from 'expo-router';
import { useAuth } from '../src/features/auth/context/AuthContext';

export default function Index() {
  const { isSignedIn } = useAuth();

  return <Redirect href={isSignedIn ? '/(tabs)' : '/(auth)/login'} />;
} 