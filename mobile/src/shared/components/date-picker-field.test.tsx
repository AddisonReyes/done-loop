import { fireEvent, render, screen } from '@testing-library/react-native';
import { Pressable as MockPressable, Text as MockText } from 'react-native';
import { mockTheme, createTestTranslator as mockCreateTestTranslator } from '@/test/test-utils';

import { DatePickerField } from './date-picker-field';

jest.mock('@react-native-community/datetimepicker', () => ({
  __esModule: true,
  default: ({ onChange }: { onChange: (_event: unknown, date?: Date) => void }) => {
    return (
      <MockPressable accessibilityRole="button" accessibilityLabel="Mock date picker" onPress={() => onChange({}, new Date(2026, 5, 4))}>
        <MockText>Mock date picker</MockText>
      </MockPressable>
    );
  },
}));

jest.mock('@/hooks/use-theme', () => ({
  useTheme: () => mockTheme,
}));

jest.mock('@/i18n', () => ({
  useTranslation: () => ({
    locale: 'en',
    t: mockCreateTestTranslator('en'),
  }),
}));

describe('DatePickerField', () => {
  it('formats the selected date and clears it', () => {
    const onChange = jest.fn();

    render(<DatePickerField label="Due date" value="2026-06-03" dateFormat="dmy" onChange={onChange} />);

    expect(screen.getByText('03/06/2026')).toBeTruthy();

    fireEvent.press(screen.getByRole('button', { name: 'Clear Due date' }));

    expect(onChange).toHaveBeenCalledWith(undefined);
  });

  it('opens the native picker and emits a local date key', () => {
    const onChange = jest.fn();

    render(<DatePickerField label="Due date" dateFormat="dmy" onChange={onChange} />);

    fireEvent.press(screen.getByRole('button', { name: 'Due date: None' }));
    fireEvent.press(screen.getByRole('button', { name: 'Mock date picker' }));

    expect(onChange).toHaveBeenCalledWith('2026-06-04');
  });
});
