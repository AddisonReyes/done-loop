import { fireEvent, render, screen } from '@testing-library/react-native';

import { mockTheme } from '@/test/test-utils';

import { TodoListItem } from './todo-list-item';
import type { Todo } from '../types';

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
        'todos.actions.complete': 'Complete',
        'todos.actions.delete': 'Delete',
        'todos.actions.edit': 'Edit',
        'todos.detail.date': 'Date',
        'todos.detail.priority': 'Priority',
        'todos.detail.status': 'Status',
        'todos.priorities.1': 'Important',
        'todos.status.pending': 'Pending',
      })[key] ?? key,
  }),
}));

const todo: Todo = {
  id: 'todo_1',
  title: 'Buy milk',
  priority: 1,
  status: 'pending',
  dueAt: '2026-06-06',
  createdAt: '2026-06-06T00:00:00.000Z',
  updatedAt: '2026-06-06T00:00:00.000Z',
};

describe('TodoListItem', () => {
  it('renders complete, edit, and delete actions on the card', () => {
    const onComplete = jest.fn();
    const onStartEdit = jest.fn();
    const onDelete = jest.fn();

    render(
      <TodoListItem
        todo={todo}
        dateLabel="June 6, 2026"
        onComplete={onComplete}
        onReopen={jest.fn()}
        onDelete={onDelete}
        onStartEdit={onStartEdit}
      />
    );

    fireEvent.press(screen.getByLabelText('Complete'));
    fireEvent.press(screen.getByLabelText('Edit'));
    fireEvent.press(screen.getByLabelText('Delete'));

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onStartEdit).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});
