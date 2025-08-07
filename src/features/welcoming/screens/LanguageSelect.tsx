import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { H1 } from '../../../components/ui/Typography';
import { colors, fonts, spacing } from '../../../constants/theme';
import { LanguageFlag } from '../components/LanguageFlag';

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

const languages: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
  },
  {
    code: 'tr',
    name: 'Turkish',
    nativeName: 'Türkçe',
  }
];

interface LanguageSelectProps {
  onSelectLanguage: (language: string) => void;
}

export default function LanguageSelect({ onSelectLanguage }: LanguageSelectProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <H1 style={styles.title}>Choose Your Language</H1>
        <H1 style={styles.title}>Dilinizi Seçin</H1>
      </View>
      
      <View style={styles.languageButtons}>
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={styles.languageButton}
            onPress={() => onSelectLanguage(lang.code)}
          >
            <LanguageFlag languageCode={lang.code} size={48} />
            <View style={styles.languageInfo}>
              <Text style={styles.languageName}>{lang.name}</Text>
              <Text style={styles.nativeName}>{lang.nativeName}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  content: {
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  title: {
    textAlign: 'center',
  },
  languageButtons: {
    gap: spacing.md,
  },
  languageButton: {
    backgroundColor: colors.surfaceLight,
    padding: spacing.lg,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  languageInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  languageName: {
    fontFamily: fonts.heading,
    fontSize: 18,
    color: colors.textPrimary,
  },
  nativeName: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.textSecondary,
  },
}); 