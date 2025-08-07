import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';
import { colors } from '../../../constants/theme';

interface LanguageFlagProps {
  languageCode: string;
  size?: number;
}

export const LanguageFlag: React.FC<LanguageFlagProps> = ({ languageCode, size = 48 }) => {
  const renderFlag = () => {
    switch (languageCode) {
      case 'en':
        return (
          <Svg width={size} height={size} viewBox="0 0 48 48">
            <Rect x="0" y="0" width="48" height="48" fill="#012169"/>
            <Path d="M0,0 L48,48 M48,0 L0,48" stroke="#FFFFFF" strokeWidth="6"/>
            <Path d="M0,0 L48,48 M48,0 L0,48" stroke="#C8102E" strokeWidth="2"/>
            <Path d="M24,0 L24,48 M0,24 L48,24" stroke="#FFFFFF" strokeWidth="10"/>
            <Path d="M24,0 L24,48 M0,24 L48,24" stroke="#C8102E" strokeWidth="6"/>
          </Svg>
        );
      case 'tr':
        return (
          <Svg width={size} height={size} viewBox="0 0 48 32">
            {/* White background */}
            <Rect x="0" y="0" width="48" height="32" fill="#FFFFFF"/>
            {/* Top red stripe */}
            <Rect x="0" y="0" width="48" height="6" fill="#E30A17"/>
            {/* Bottom red stripe */}
            <Rect x="0" y="26" width="48" height="6" fill="#E30A17"/>
            {/* Crescent and star */}
            <G transform="translate(16, 16)">
              <Circle r="6" fill="#E30A17"/>
              <Circle cx="2" r="5" fill="#FFFFFF"/>
              {/* Five-pointed star */}
              <Path
                d="M 7,-2 L 8.09,1.18 11.5,1.18 8.705,3.09 9.79,6.27 7,4.36 4.21,6.27 5.295,3.09 2.5,1.18 5.91,1.18 Z"
                fill="#E30A17"
                transform="translate(-1, -2) scale(0.7)"
              />
            </G>
          </Svg>
        );
      default:
        return (
          <View style={[
            styles.defaultFlag,
            { width: size, height: size }
          ]} />
        );
    }
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {renderFlag()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  defaultFlag: {
    backgroundColor: colors.surfaceLight,
  },
}); 