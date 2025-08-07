import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { Body, H1 } from '../../../components/ui/Typography';
import { colors, spacing } from '../../../constants/theme';
import { OnboardingStep, useOnboarding } from '../hooks/useOnboarding';

const { width } = Dimensions.get('window');

const PlaceholderImage = ({ iconName }: { iconName: OnboardingStep['icon'] }) => (
  <View style={styles.placeholderImage}>
    <View style={styles.iconBackground}>
      <Ionicons name={iconName} size={64} color={colors.primary} />
    </View>
    <View style={[styles.decorCircle, styles.decorCircle1]} />
    <View style={[styles.decorCircle, styles.decorCircle2]} />
    <View style={[styles.decorCircle, styles.decorCircle3]} />
  </View>
);

interface OnboardingProps {
  onBack?: () => void;
  onComplete?: () => void;
}

export default function Onboarding({ onBack, onComplete }: OnboardingProps) {
  const { t } = useTranslation();
  const {
    currentStepData,
    isFirstStep,
    isLastStep,
    goToNextStep,
    goToPreviousStep,
  } = useOnboarding();

  const handleNext = () => {
    const isComplete = goToNextStep();
    if (isComplete && onComplete) {
      onComplete();
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View 
        entering={FadeInRight} 
        exiting={FadeOutLeft}
        style={styles.step}
      >
        <View style={styles.imageContainer}>
          <PlaceholderImage iconName={currentStepData.icon} />
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.content}>
            <H1 style={styles.title}>{currentStepData.title}</H1>
            <Body style={styles.description}>{currentStepData.description}</Body>
          </View>
          
          <View style={styles.footer}>
            <View style={styles.buttonContainer}>
              {isFirstStep ? (
                <TouchableOpacity 
                  style={[styles.button, styles.backButton]} 
                  onPress={onBack}
                >
                  <Ionicons 
                    name="language" 
                    size={24} 
                    color={colors.textPrimary}
                    style={styles.buttonIcon} 
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={[styles.button, styles.backButton]} 
                  onPress={goToPreviousStep}
                >
                  <Ionicons 
                    name="chevron-back" 
                    size={24} 
                    color={colors.textPrimary}
                    style={styles.buttonIcon} 
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                style={[styles.button, styles.nextButton]} 
                onPress={handleNext}
              >
                <Body style={styles.buttonText}>
                  {isLastStep 
                    ? t('onboarding.button.getStarted') 
                    : t('onboarding.button.next')}
                </Body>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  step: {
    flex: 1,
    width: width,
    alignItems: 'center',
    paddingTop: spacing.xl,
  },
  imageContainer: {
    flex: 0.4,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: spacing.lg,
  },
  placeholderImage: {
    width: width * 0.7,
    height: width * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  iconBackground: {
    width: 120,
    height: 120,
    backgroundColor: colors.surfaceLight,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  decorCircle: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.primary,
    opacity: 0.1,
  },
  decorCircle1: {
    width: width * 0.6,
    height: width * 0.6,
  },
  decorCircle2: {
    width: width * 0.5,
    height: width * 0.5,
    borderStyle: 'dashed',
  },
  decorCircle3: {
    width: width * 0.4,
    height: width * 0.4,
    borderStyle: 'dotted',
  },
  contentContainer: {
    flex: 0.5,
    width: '100%',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
    paddingTop: 0,
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    textAlign: 'center',
    maxWidth: '85%',
    marginTop: spacing.sm,
  },
  footer: {
    padding: spacing.xl,
    paddingBottom: spacing.sm * 0.1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
    alignItems: 'center',
  },
  button: {
    paddingVertical: spacing.md,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  backButton: {
    backgroundColor: colors.surfaceLight,
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  buttonIcon: {
    margin: 0,
    alignSelf: 'center',
    width: 24,
    height: 24,
  },
  nextButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.sm,
    flex: 1,
    height: 52,
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.textLight,
    textAlign: 'center',
  },
}); 