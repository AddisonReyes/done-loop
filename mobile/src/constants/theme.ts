import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#18181B',
    background: '#F7F7FB',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#F0EEF8',
    border: '#E4E4EA',
    borderStrong: '#D7C8F7',
    accent: '#8B5CF6',
    accentSoft: 'rgba(139, 92, 246, 0.14)',
    accentStrong: '#6D28D9',
    success: '#0284C7',
    warning: '#B45309',
    danger: '#E11D48',
    textSecondary: '#52525B',
    textMuted: '#71717A',
    surfaceSoft: '#FFFFFF',
    surfaceStrong: '#FFFFFF',
    glow: 'rgba(24, 24, 27, 0.08)',
    washTop: '#F7F7FB',
    washMid: '#F7F7FB',
    sheenStart: 'transparent',
    sheenEnd: 'transparent',
    historyEmpty: 'rgba(233, 213, 255, 0.52)',
    historyPartial: 'rgba(168, 85, 247, 0.34)',
    historyComplete: '#A855F7',
  },
  dark: {
    text: '#F5F3FF',
    background: '#0B0B0F',
    backgroundElement: '#17171D',
    backgroundSelected: '#22222A',
    border: '#2B2B34',
    borderStrong: '#4B3A68',
    accent: '#A855F7',
    accentSoft: 'rgba(168, 85, 247, 0.18)',
    accentStrong: '#C084FC',
    success: '#7DD3FC',
    warning: '#FBBF24',
    danger: '#FB7185',
    textSecondary: '#A1A1AA',
    textMuted: '#71717A',
    surfaceSoft: '#17171D',
    surfaceStrong: '#22222A',
    glow: 'rgba(0, 0, 0, 0.24)',
    washTop: '#0B0B0F',
    washMid: '#0B0B0F',
    sheenStart: 'transparent',
    sheenEnd: 'transparent',
    historyEmpty: 'rgba(63, 63, 70, 0.52)',
    historyPartial: 'rgba(192, 132, 252, 0.56)',
    historyComplete: '#A855F7',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
