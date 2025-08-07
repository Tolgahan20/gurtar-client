import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Animated, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { colors, spacing } from '../constants/theme';
import { Body } from './ui/Typography';

type ToastType = 'success' | 'error';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  onDismiss: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type = 'success',
  onDismiss,
  duration = 3000,
}) => {
  const translateY = new Animated.Value(-100);
  const opacity = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
        },
        type === 'error' ? styles.errorContainer : styles.successContainer,
      ]}
    >
      <View style={styles.content}>
        <Ionicons
          name={type === 'error' ? 'alert-circle' : 'checkmark-circle'}
          size={24}
          color={type === 'error' ? colors.error : colors.success}
        />
        <Body style={styles.message}>{message}</Body>
      </View>
      <TouchableOpacity onPress={handleDismiss}>
        <Ionicons name="close" size={24} color={colors.textSecondary} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    padding: spacing.md,
    margin: spacing.md,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: colors.textPrimary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  successContainer: {
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  errorContainer: {
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  message: {
    marginLeft: spacing.sm,
    flex: 1,
    color: colors.textPrimary,
  },
}); 