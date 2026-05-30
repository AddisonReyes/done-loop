import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import type { HabitFilter } from '../hooks/use-habits-mvp';

type HabitFilterTabsProps = {
  value: HabitFilter;
  onChange: (filter: HabitFilter) => void;
};

const filters: { value: HabitFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'pendingToday', label: 'Pendientes' },
  { value: 'completedToday', label: 'Listos' },
];

export function HabitFilterTabs({ value, onChange }: HabitFilterTabsProps) {
  const theme = useTheme();

  return (
    <ThemedView type="backgroundSelected" style={styles.container}>
      {filters.map((filter) => {
        const selected = filter.value === value;

        return (
          <Pressable
            key={filter.value}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(filter.value)}
            style={({ pressed }) => [
              styles.button,
              selected && { backgroundColor: theme.accentSoft },
              pressed && styles.pressed,
            ]}>
            <ThemedText
              type="smallBold"
              themeColor={selected ? 'accent' : 'textSecondary'}
              style={styles.buttonLabel}>
              {filter.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    flexDirection: 'row',
    padding: Spacing.one,
    gap: Spacing.one,
  },
  button: {
    minHeight: 42,
    flex: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.two,
  },
  buttonLabel: {
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.72,
  },
});
