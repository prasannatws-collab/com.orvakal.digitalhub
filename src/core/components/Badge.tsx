import React from 'react';
import { StyleSheet, Text, View, type ViewStyle, type TextStyle } from 'react-native';
import { useTheme } from '../state/ThemeContext';

interface BadgeProps {
  children: string;
  variant?: 'default' | 'success' | 'info' | 'danger' | 'warning';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', style }) => {
  const { colors } = useTheme();

  const getStyles = () => {
    switch (variant) {
      case 'success':
        return {
          bg: '#DCFCE7',
          text: '#15803D',
        };
      case 'danger':
        return {
          bg: '#FEE2E2',
          text: '#B91C1C',
        };
      case 'warning':
        return {
          bg: '#FEF3C7',
          text: '#B45309',
        };
      case 'info':
        return {
          bg: `${colors.primary}15`,
          text: colors.primary,
        };
      default:
        return {
          bg: colors.muted,
          text: colors.mutedForeground,
        };
    }
  };

  const currentStyles = getStyles();

  return (
    <View style={[styles.badge, { backgroundColor: currentStyles.bg }, style]}>
      <Text style={[styles.text, { color: currentStyles.text }]}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
  },
});
