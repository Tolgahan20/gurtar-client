import React, { useRef, useState } from 'react';
import {
  NativeSyntheticEvent,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TextInputKeyPressEventData,
  View,
} from 'react-native';
import { Body } from '../../../components/ui/Typography';
import { colors, spacing } from '../../../constants/theme';

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value,
  onChange,
  error,
}) => {
  const inputRefs = useRef<TextInput[]>([]);
  const [isFocused, setIsFocused] = useState<boolean[]>(new Array(length).fill(false));

  const handleChange = (text: string, index: number) => {
    const newValue = value.split('');
    newValue[index] = text;
    const finalValue = newValue.join('');
    onChange(finalValue);

    if (text.length > 0 && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (e.nativeEvent.key === 'Backspace' && index > 0 && !value[index]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleFocus = (index: number) => {
    const newFocused = [...isFocused];
    newFocused[index] = true;
    setIsFocused(newFocused);
  };

  const handleBlur = (index: number) => {
    const newFocused = [...isFocused];
    newFocused[index] = false;
    setIsFocused(newFocused);
  };

  const handlePress = () => {
    // Find the first empty box or the last box
    const index = value.length < length ? value.length : length - 1;
    inputRefs.current[index]?.focus();
  };

  return (
    <Pressable onPress={handlePress}>
      <View style={styles.container}>
        {Array(length)
          .fill(0)
          .map((_, index) => {
            const digit = value[index] || '';
            const isCurrentFocused = isFocused[index];
            const hasError = !!error && value.length === length;

            return (
              <View
                key={index}
                style={[
                  styles.inputContainer,
                  isCurrentFocused && styles.inputContainerFocused,
                  hasError && styles.inputContainerError,
                ]}
              >
                <TextInput
                  ref={(ref) => {
                    if (ref) inputRefs.current[index] = ref;
                  }}
                  style={styles.input}
                  maxLength={1}
                  keyboardType="number-pad"
                  value={digit}
                  onChangeText={(text) => handleChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  onFocus={() => handleFocus(index)}
                  onBlur={() => handleBlur(index)}
                  selectionColor={colors.primary}
                />
              </View>
            );
          })}
      </View>
      {error && <Body style={styles.error}>{error}</Body>}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  inputContainer: {
    width: 45,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainerFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
  inputContainerError: {
    borderColor: colors.error,
  },
  input: {
    fontSize: 20,
    textAlign: 'center',
    color: colors.textPrimary,
    height: Platform.OS === 'ios' ? 52 : 'auto',
    width: '100%',
  },
  error: {
    color: colors.error,
    marginTop: spacing.sm,
  },
}); 