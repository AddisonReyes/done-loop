import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/i18n';

type FloatingCreateButtonProps = {
  onPress: () => void;
};

export function FloatingCreateButton({ onPress }: FloatingCreateButtonProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Pressable
      accessibilityLabel={t('common.create')}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: theme.accent,
          borderColor: theme.borderStrong,
          bottom: insets.bottom + 86,
          shadowColor: theme.glow,
        },
        pressed && styles.pressed,
      ]}>
      <SymbolView
        name="plus"
        tintColor="#FFFFFF"
        size={30}
        weight="bold"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 28,
    borderWidth: 1,
    height: 56,
    justifyContent: 'center',
    position: 'absolute',
    right: Spacing.three,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    width: 56,
    zIndex: 20,
    elevation: 12,
  },
  pressed: {
    opacity: 0.78,
  },
});
