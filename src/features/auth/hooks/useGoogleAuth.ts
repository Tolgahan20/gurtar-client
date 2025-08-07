import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useEffect } from "react";
import { Platform } from "react-native";
import { useAuthService } from "../services/authService";

const useGoogleAuth = () => {
  const { googleLogin } = useAuthService();

  useEffect(() => {
    const config: {
      scopes: string[];
      iosClientId?: string;
      androidClientId?: string;
    } = {
      scopes: ['profile', 'email'],
    };

    if (Platform.OS === 'ios') {
      config.iosClientId = process.env.EXPO_PUBLIC_IOS_CLIENT_ID;
    } else {
      config.androidClientId = process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID;
    }

    GoogleSignin.configure(config);
  }, []);

  const handleGoogleLogin = async (idToken: string) => {
    try {
      await googleLogin(idToken);
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    }
  };

  const login = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      
      if (!tokens.idToken) {
        throw new Error("No ID token present in Google Sign-In response");
      }

      await handleGoogleLogin(tokens.idToken);
    } catch (error: any) {
      console.error("Google sign in error:", error);
      
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        throw new Error("Google sign in was cancelled");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        throw new Error("Google sign in is already in progress");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new Error("Play services not available or outdated");
      } else {
        throw error;
      }
    }
  };

  return {
    login,
    isLoading: false,
  };
};

export default useGoogleAuth;
