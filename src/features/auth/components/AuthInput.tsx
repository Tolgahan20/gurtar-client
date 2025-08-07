import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import { colors, fonts, spacing } from '../../../constants/theme';

interface AuthInputProps extends TextInputProps {
  icon: keyof typeof Ionicons.glyphMap;
  error?: string;
  isPassword?: boolean;
}

export const AuthInput: React.FC<AuthInputProps> = ({
  icon,
  error,
  isPassword,
  style,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputContainer,
          error ? styles.inputError : null,
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={error ? colors.error : colors.textSecondary}
          style={styles.icon}
        />
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.passwordToggle}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={16} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 52,
  },
  inputError: {
    borderColor: colors.error,
  },
  icon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontFamily: fonts.body,
    fontSize: 16,
  },
  passwordToggle: {
    padding: spacing.xs,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  errorText: {
    color: colors.error,
    fontFamily: fonts.body,
    fontSize: 12,
    marginLeft: spacing.xs,
  },
}); 