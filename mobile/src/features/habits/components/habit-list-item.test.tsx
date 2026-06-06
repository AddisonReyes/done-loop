import { fireEvent, render, screen } from '@testing-library/react-native';

import { mockTheme } from '@/test/test-utils';

import { HabitListItem } from './habit-list-item';
import type { Habit } from '../types';

jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

jest.mock('@/hooks/use-theme', () => ({
  useTheme: () => mockTheme,
}));

jest.mock('@/hooks/use-theme-preference', () => ({
  useThemePreference: () => ({
    animationsEnabled: false,
  }),
}));

jest.mock('@/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) =>
      ({
        'common.off': 'Off',
        'common.on': 'On',
        'habits.completedToday': 'Completed today',
        'habits.delete': 'Delete',
        'habits.detail.recurrence': 'Recurrence',
        'habits.detail.reminder': 'Reminder',
        'habits.detail.status': 'Status',
        'habits.edit': 'Edit',
        'habits.pendingToday': 'Pending today',
        'habits.recurrences.daily': 'Daily',
      })[key] ?? key,
  }),
}));

const habit: Habit = {
  id: 'habit_1',
  name: 'Read',
  recurrenceType: 'daily',
  remindersEnabled: false,
  isActive: true,
  startDate: '2026-06-01',
  createdAt: '2026-06-01T00:00:00.000Z',
  updatedAt: '2026-06-01T00:00:00.000Z',
};

describe('HabitListItem', () => {
  it('renders completion, edit, and delete actions on the card', () => {
    const onToggleToday = jest.fn();
    const onStartEdit = jest.fn();
    const onDelete = jest.fn();

    render(
      <HabitListItem
        habit={habit}
        completedToday={false}
        onToggleToday={onToggleToday}
        onStartEdit={onStartEdit}
        onDelete={onDelete}
      />
    );

    fireEvent.press(screen.getByLabelText('Pending today'));
    fireEvent.press(screen.getByLabelText('Edit'));
    fireEvent.press(screen.getByLabelText('Delete'));

    expect(onToggleToday).toHaveBeenCalledTimes(1);
    expect(onStartEdit).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('does not toggle completion when completion is disabled', () => {
    const onToggleToday = jest.fn();

    render(
      <HabitListItem
        habit={habit}
        completedToday={false}
        completionDisabled
        onToggleToday={onToggleToday}
        onStartEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    const completionAction = screen.getByLabelText('Pending today');

    expect(completionAction.props.accessibilityState).toEqual({
      checked: false,
      disabled: true,
    });

    fireEvent.press(completionAction);

    expect(onToggleToday).not.toHaveBeenCalled();
  });

  it('uses an X icon when the completion action will unmark a completed habit', () => {
    render(
      <HabitListItem
        habit={habit}
        completedToday
        onToggleToday={jest.fn()}
        onStartEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    const completionAction = screen.getByLabelText('Completed today');
    const completionIcon = completionAction.findByProps({ name: 'close' });

    expect(completionIcon).toBeTruthy();
  });
});
