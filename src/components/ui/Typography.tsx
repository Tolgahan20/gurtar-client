import React from 'react';
import { StyleSheet, Text, TextProps, TextStyle } from 'react-native';
import { colors, typography } from '../../constants/theme';

interface TypographyProps extends TextProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export const H1: React.FC<TypographyProps> = ({ style, children, ...props }) => (
  <Text style={[styles.h1, style]} {...props}>
    {children}
  </Text>
);

export const H2: React.FC<TypographyProps> = ({ style, children, ...props }) => (
  <Text style={[styles.h2, style]} {...props}>
    {children}
  </Text>
);

export const Body: React.FC<TypographyProps> = ({ style, children, ...props }) => (
  <Text style={[styles.body, style]} {...props}>
    {children}
  </Text>
);

const styles = StyleSheet.create({
  h1: {
    ...typography.h1,
    color: colors.textPrimary,
    fontWeight: 'normal',
  },
  h2: {
    ...typography.h2,
    color: colors.textPrimary,
    fontWeight: 'normal',
  },
  body: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: 'normal',
  },
}); 