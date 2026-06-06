import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/i18n';

export type HabitDayActivity = 'none' | 'partial' | 'complete';
export type HabitDayIntensity = 0 | 1 | 2 | 3 | 4;
export type HabitHistoryDay = {
  dateKey: string;
  dayNumber: number;
  activity: HabitDayActivity;
  completedCount: number;
  scheduledCount: number;
  intensity: HabitDayIntensity;
};

type HabitHistoryTheme = Pick<
  ReturnType<typeof useTheme>,
  'historyEmpty' | 'historyLevel1' | 'historyLevel2' | 'historyLevel3' | 'historyLevel4'
>;

type HabitMonthHistoryProps = {
  monthLabel: string;
  days: HabitHistoryDay[];
  monthlyMarkedDateKeys?: Set<string>;
  selectedDateKey?: string;
  onSelectDate?: (dateKey: string) => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
};

export function getHabitHistoryColor(theme: HabitHistoryTheme, intensity: HabitDayIntensity): string {
  if (intensity === 4) {
    return theme.historyLevel4;
  }

  if (intensity === 3) {
    return theme.historyLevel3;
  }

  if (intensity === 2) {
    return theme.historyLevel2;
  }

  if (intensity === 1) {
    return theme.historyLevel1;
  }

  return theme.historyEmpty;
}

export function HabitMonthHistory({
  monthLabel,
  monthlyMarkedDateKeys,
  selectedDateKey,
  days,
  onSelectDate,
  onPreviousMonth,
  onNextMonth,
}: HabitMonthHistoryProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [gridWidth, setGridWidth] = useState(0);
  const cellGap = Spacing.one;
  const cellSize = gridWidth > 0 ? Math.floor((gridWidth - cellGap * 6) / 7) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel={t('calendar.previousMonth')}
          accessibilityRole="button"
          onPress={onPreviousMonth}
          style={[styles.navButton, { backgroundColor: theme.backgroundSelected, borderColor: theme.border }]}>
          <ThemedText type="smallBold" themeColor="accentStrong">
            ‹
          </ThemedText>
        </Pressable>
        <ThemedText type="smallBold" style={styles.monthLabel}>
          {monthLabel}
        </ThemedText>
        <Pressable
          accessibilityLabel={t('calendar.nextMonth')}
          accessibilityRole="button"
          onPress={onNextMonth}
          style={[styles.navButton, { backgroundColor: theme.backgroundSelected, borderColor: theme.border }]}>
          <ThemedText type="smallBold" themeColor="accentStrong">
            ›
          </ThemedText>
        </Pressable>
      </View>

      <View
        style={[styles.grid, { gap: cellGap }]}
        onLayout={(event) => setGridWidth(event.nativeEvent.layout.width)}>
        {days.map((day) => {
          const monthlyMarked = monthlyMarkedDateKeys?.has(day.dateKey) ?? false;
          const selected = selectedDateKey === day.dateKey;
          const backgroundColor = getHabitHistoryColor(theme, day.intensity);
          const dayTextHighContrast = day.intensity >= 3;
          const activityLabel =
            day.scheduledCount > 0
              ? t('habits.history.dayProgress', {
                  activity: t(`habits.history.${day.activity}`),
                  completed: day.completedCount,
                  total: day.scheduledCount,
                })
              : t(`habits.history.${day.activity}`);

          return (
            <Pressable
              key={day.dateKey}
              accessibilityRole={onSelectDate ? 'button' : undefined}
              accessibilityState={onSelectDate ? { selected } : undefined}
              accessibilityLabel={t('habits.history.dayActivity', {
                date: day.dateKey,
                activity: activityLabel,
              })}
              disabled={!onSelectDate}
              onPress={() => onSelectDate?.(day.dateKey)}
              style={[
                styles.day,
                {
                  backgroundColor: selected && day.activity === 'none' ? theme.accentSoft : backgroundColor,
                  borderColor: selected
                    ? theme.accentStrong
                    : day.activity === 'none'
                      ? theme.border
                      : theme.borderStrong,
                  height: cellSize || undefined,
                  width: cellSize || undefined,
                },
              ]}>
              {monthlyMarked ? (
                <View
                  style={[
                    styles.monthlyMarker,
                    {
                      backgroundColor: theme.accentStrong,
                      borderColor: day.intensity > 0 ? '#FFFFFF' : theme.backgroundElement,
                    },
                  ]}
                />
              ) : null}
              <ThemedText
                type="code"
                style={[
                  styles.dayNumber,
                  dayTextHighContrast && styles.highContrastDayText,
                  selected && !dayTextHighContrast && { color: theme.accentStrong },
                ]}>
                {day.dayNumber}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.legend}>
        <LegendDot label={t('habits.history.none')} color={theme.historyEmpty} borderColor={theme.border} />
        <LegendDot
          label={t('habits.history.partial')}
          color={[theme.historyLevel1, theme.historyLevel2, theme.historyLevel3]}
          borderColor={theme.border}
        />
        <LegendDot label={t('habits.history.complete')} color={theme.historyLevel4} borderColor={theme.border} />
      </View>
    </View>
  );
}

function LegendDot({ borderColor, label, color }: { borderColor: string; label: string; color: string | string[] }) {
  const colors = Array.isArray(color) ? color : [color];

  return (
    <View style={styles.legendItem}>
      <View style={styles.legendDots}>
        {colors.map((currentColor) => (
          <View key={currentColor} style={[styles.legendDot, { backgroundColor: currentColor, borderColor }]} />
        ))}
      </View>
      <ThemedText type="small" themeColor="textSecondary" style={styles.legendLabel}>
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
    gap: Spacing.two,
    justifyContent: 'space-between',
  },
  navButton: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    flexShrink: 0,
    justifyContent: 'center',
  },
  monthLabel: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    minWidth: 0,
  },
  day: {
    aspectRatio: 1,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  monthlyMarker: {
    borderRadius: 5,
    borderWidth: 1,
    height: 10,
    position: 'absolute',
    right: 5,
    top: 5,
    width: 10,
  },
  dayNumber: {
    textAlign: 'center',
  },
  highContrastDayText: {
    color: '#FFFFFF',
  },
  legend: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    gap: Spacing.one,
  },
  legendDots: {
    flexDirection: 'row',
    gap: Spacing.half,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  legendLabel: {
    flexShrink: 1,
  },
});
