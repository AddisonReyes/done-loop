import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type HabitDayActivity = 'none' | 'partial' | 'complete';

type HabitMonthHistoryProps = {
  monthLabel: string;
  days: { dateKey: string; dayNumber: number; activity: HabitDayActivity }[];
  onPreviousMonth: () => void;
  onNextMonth: () => void;
};

export function HabitMonthHistory({
  monthLabel,
  days,
  onPreviousMonth,
  onNextMonth,
}: HabitMonthHistoryProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" onPress={onPreviousMonth} style={styles.navButton}>
          <ThemedText type="smallBold">‹</ThemedText>
        </Pressable>
        <ThemedText type="smallBold" style={styles.monthLabel}>
          {monthLabel}
        </ThemedText>
        <Pressable accessibilityRole="button" onPress={onNextMonth} style={styles.navButton}>
          <ThemedText type="smallBold">›</ThemedText>
        </Pressable>
      </View>

      <View style={styles.grid}>
        {days.map((day) => {
          const backgroundColor =
            day.activity === 'complete'
              ? theme.accent
              : day.activity === 'partial'
                ? theme.warning
                : theme.backgroundSelected;

          return (
            <ThemedView
              key={day.dateKey}
              accessibilityLabel={`${day.dateKey}: ${day.activity}`}
              style={[styles.day, { backgroundColor }]}>
              <ThemedText
                type="code"
                style={[styles.dayNumber, day.activity !== 'none' && styles.activeDayText]}>
                {day.dayNumber}
              </ThemedText>
            </ThemedView>
          );
        })}
      </View>

      <View style={styles.legend}>
        <LegendDot label="Sin actividad" color={theme.backgroundSelected} />
        <LegendDot label="Parcial" color={theme.warning} />
        <LegendDot label="Completa" color={theme.accent} />
      </View>
    </View>
  );
}

function LegendDot({ label, color }: { label: string; color: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  header: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthLabel: {
    textTransform: 'capitalize',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
  },
  day: {
    width: 42,
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNumber: {
    textAlign: 'center',
  },
  activeDayText: {
    color: '#FFFFFF',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
