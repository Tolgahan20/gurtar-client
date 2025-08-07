export interface LoginForm {
  email: string;
  password: string;
}

export interface LoginErrors {
  email?: string;
  password?: string;
}

export interface RegisterForm {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterErrors {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  message?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface RegisterDto {
  email: string;
  password: string;
  full_name: string;
  phone_number: string;
  profile_image_url?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface VerifyEmailDto {
  email: string;
  otp: string;
}

export interface GoogleLoginDto {
  idToken: string;
  platform: 'ios' | 'android';
} 