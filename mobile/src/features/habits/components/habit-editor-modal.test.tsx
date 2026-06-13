import { fireEvent, render, screen } from '@testing-library/react-native';
import type { PropsWithChildren } from 'react';
import { Pressable as MockPressable, Text as MockText } from 'react-native';

import { mockTheme, createTestTranslator as mockCreateTestTranslator } from '@/test/test-utils';

import { HabitEditorModal } from './habit-editor-modal';

jest.mock('@/hooks/use-theme', () => ({
  useTheme: () => mockTheme,
}));

jest.mock('@/i18n', () => ({
  useTranslation: () => ({
    locale: 'en',
    t: mockCreateTestTranslator('en'),
  }),
}));

jest.mock('@/shared/components/app-modal', () => ({
  AppModal: ({ children, visible }: PropsWithChildren<{ visible: boolean }>) => (visible ? <>{children}</> : null),
}));

jest.mock('@/shared/components/dropdown-select', () => ({
  DropdownSelect: <T extends string>({
    options,
    onChange,
  }: {
    options: { label: string; value: T }[];
    onChange: (value: T) => void;
  }) => (
    (() => {
      return (
        <>
          {options.map((option) => (
            <MockPressable key={option.value} accessibilityRole="button" onPress={() => onChange(option.value)}>
              <MockText>{option.label}</MockText>
            </MockPressable>
          ))}
        </>
      );
    })()
  ),
}));

jest.mock('@/shared/components/date-picker-field', () => ({
  DatePickerField: ({ label, onChange }: { label: string; onChange: (value?: string) => void }) => {
    return (
      <MockPressable accessibilityRole="button" onPress={() => onChange('2026-06-15')}>
        <MockText>{label}</MockText>
      </MockPressable>
    );
  },
}));

jest.mock('@/shared/components/time-picker-field', () => ({
  TimePickerField: ({ label, onChange }: { label: string; onChange: (value?: string) => void }) => {
    return (
      <MockPressable accessibilityRole="button" onPress={() => onChange('08:30')}>
        <MockText>{label}</MockText>
      </MockPressable>
    );
  },
}));

describe('HabitEditorModal', () => {
  it('requires a positive custom interval before submit', () => {
    const onSubmit = jest.fn();

    render(<HabitEditorModal visible onClose={jest.fn()} onSubmit={onSubmit} />);

    fireEvent.changeText(screen.getByLabelText('Habit name'), '  Read  ');
    fireEvent.press(screen.getByRole('button', { name: 'Custom' }));

    expect(screen.getByText('Enter a whole number greater than zero.')).toBeTruthy();

    const submit = screen.getByRole('button', { name: 'Create' });
    expect(submit.props.accessibilityState).toMatchObject({ disabled: true });
    fireEvent.press(submit);

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits a valid custom interval as a number', () => {
    const onSubmit = jest.fn();

    render(<HabitEditorModal visible onClose={jest.fn()} onSubmit={onSubmit} />);

    fireEvent.changeText(screen.getByLabelText('Habit name'), '  Read  ');
    fireEvent.changeText(screen.getByLabelText('Description'), '  Ten pages  ');
    fireEvent.press(screen.getByRole('button', { name: 'Custom' }));
    fireEvent.changeText(screen.getByLabelText('Every N days'), '3');
    fireEvent.press(screen.getByRole('button', { name: 'Create' }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Read',
      description: 'Ten pages',
      recurrenceType: 'custom',
      customIntervalDays: 3,
      weeklyDays: undefined,
      monthlyDays: undefined,
      remindersEnabled: false,
      reminderTime: undefined,
      isActive: true,
    });
  });

  it('requires a reminder time when reminders are enabled', () => {
    const onSubmit = jest.fn();

    render(<HabitEditorModal visible onClose={jest.fn()} onSubmit={onSubmit} />);

    fireEvent.changeText(screen.getByLabelText('Habit name'), 'Read');
    fireEvent(screen.getByRole('switch'), 'valueChange', true);

    const submit = screen.getByRole('button', { name: 'Create' });
    expect(submit.props.accessibilityState).toMatchObject({ disabled: true });

    fireEvent.press(screen.getByRole('button', { name: 'Reminder time' }));
    fireEvent.press(submit);

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Read',
      remindersEnabled: true,
      reminderTime: '08:30',
    }));
  });

  it('shows archive toggle only when editing', () => {
    const habit = {
      id: 'habit_1',
      name: 'Read',
      recurrenceType: 'daily' as const,
      remindersEnabled: false,
      isActive: true,
      createdAt: '2026-06-01T00:00:00.000Z',
      updatedAt: '2026-06-01T00:00:00.000Z',
    };

    const { rerender } = render(<HabitEditorModal visible onClose={jest.fn()} onSubmit={jest.fn()} />);
    expect(screen.queryByText('Archived')).toBeNull();

    rerender(<HabitEditorModal habit={habit} visible onClose={jest.fn()} onSubmit={jest.fn()} />);
    expect(screen.getByText('Archived')).toBeTruthy();
  });

  it('submits archived edits as inactive', () => {
    const onSubmit = jest.fn();
    const habit = {
      id: 'habit_1',
      name: 'Read',
      recurrenceType: 'daily' as const,
      remindersEnabled: false,
      isActive: true,
      createdAt: '2026-06-01T00:00:00.000Z',
      updatedAt: '2026-06-01T00:00:00.000Z',
    };

    render(<HabitEditorModal habit={habit} visible onClose={jest.fn()} onSubmit={onSubmit} />);

    fireEvent(screen.getAllByRole('switch')[1], 'valueChange', true);
    fireEvent.press(screen.getByRole('button', { name: 'Save' }));

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ isActive: false }));
  });
});
