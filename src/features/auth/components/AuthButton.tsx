import React from 'react';
import { ActivityIndicator, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Body } from '../../../components/ui/Typography';
import { colors, spacing } from '../../../constants/theme';

interface AuthButtonProps {
  onPress: () => void;
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  style?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  onPress,
  title,
  loading = false,
  variant = 'primary',
  style,
  icon,
}) => {
  const buttonStyles = [
    styles.button,
    variant === 'secondary' && styles.buttonSecondary,
    style,
  ];

  const textStyles = [
    styles.text,
    variant === 'secondary' && styles.textSecondary,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.textLight : colors.primary} />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Body style={textStyles}>{title}</Body>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  buttonSecondary: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  text: {
    color: colors.textLight,
    textAlign: 'center',
  },
  textSecondary: {
    color: colors.textPrimary,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: spacing.sm,
  },
}); 