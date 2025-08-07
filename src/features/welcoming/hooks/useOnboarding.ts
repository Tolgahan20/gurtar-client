import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: 'fast-food' | 'search' | 'leaf' | 'time';
}

export const useOnboarding = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);

  const onboardingSteps: OnboardingStep[] = [
    {
      id: 1,
      title: t('onboarding.welcome.title'),
      description: t('onboarding.welcome.description'),
      icon: "fast-food"
    },
    {
      id: 2,
      title: t('onboarding.discover.title'),
      description: t('onboarding.discover.description'),
      icon: "search"
    },
    {
      id: 3,
      title: t('onboarding.save.title'),
      description: t('onboarding.save.description'),
      icon: "leaf"
    },
    {
      id: 4,
      title: t('onboarding.pickup.title'),
      description: t('onboarding.pickup.description'),
      icon: "time"
    }
  ];

  const goToNextStep = useCallback(() => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      return false;
    }
    return true;
  }, [currentStep, onboardingSteps.length]);

  const goToPreviousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === onboardingSteps.length - 1;

  return {
    currentStep,
    currentStepData: onboardingSteps[currentStep],
    totalSteps: onboardingSteps.length,
    isFirstStep,
    isLastStep,
    goToNextStep,
    goToPreviousStep,
  };
}; 