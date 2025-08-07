
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot, router, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Linking } from 'react-native';
import { ToastProvider } from '../src/context/ToastContext';
import { AuthProvider } from '../src/features/auth/context/AuthContext';
import '../src/i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export default function RootLayout() {
  const { i18n } = useTranslation();
  const segments = useSegments();

  useEffect(() => {
    i18n.init();
  }, [i18n]);

  useEffect(() => {
    // Handle deep links when app is already open
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Handle deep links when app is opened from a link
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    }).catch(error => {
      console.error('Error getting initial URL:', error);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleDeepLink = ({ url }: { url: string }) => {
    if (!url) return;

    console.log('Handling deep link:', url); // Debug log

    try {
      // Parse URL regardless of scheme
      const urlObj = new URL(url.replace('gurtar://', 'https://gurtar.com/'));
      
      // Extract path and query parameters
      const path = urlObj.pathname.replace(/^\/+/, ''); // Remove all leading slashes
      const params = Object.fromEntries(urlObj.searchParams);

      console.log('Parsed deep link:', { path, params }); // Debug log

      if (path === 'verify-email') {
        const { otp, email } = params;
        
        if (otp) {
          // Navigate to verification screen with OTP and email
          router.replace({
            pathname: '/verify-email',
            params: { 
              otp,
              email: email || '' // Include email if available
            }
          });
        } else {
          Alert.alert(
            'Invalid Link',
            'The verification link appears to be invalid. Please try again or request a new verification email.'
          );
        }
      }
    } catch (error) {
      console.error('Error handling deep link:', error);
      Alert.alert(
        'Link Error',
        'There was a problem opening the link. Please try again or open the app manually.'
      );
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <Slot />
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}
