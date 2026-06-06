import { mockTheme } from '@/test/test-utils';

import { getHabitHistoryColor } from './habit-month-history';

jest.mock('@/components/themed-text', () => ({
  ThemedText: 'Text',
}));

jest.mock('@/hooks/use-theme', () => ({
  useTheme: () => mockTheme,
}));

jest.mock('@/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('HabitMonthHistory', () => {
  it('maps day intensities to history colors', () => {
    expect(getHabitHistoryColor(mockTheme, 0)).toBe(mockTheme.historyEmpty);
    expect(getHabitHistoryColor(mockTheme, 1)).toBe(mockTheme.historyLevel1);
    expect(getHabitHistoryColor(mockTheme, 2)).toBe(mockTheme.historyLevel2);
    expect(getHabitHistoryColor(mockTheme, 3)).toBe(mockTheme.historyLevel3);
    expect(getHabitHistoryColor(mockTheme, 4)).toBe(mockTheme.historyLevel4);
  });
});
