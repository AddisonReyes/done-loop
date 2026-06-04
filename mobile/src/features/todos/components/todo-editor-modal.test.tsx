import { fireEvent, render, screen } from '@testing-library/react-native';
import type { PropsWithChildren } from 'react';
import { Pressable as MockPressable, Text as MockText } from 'react-native';

import { mockTheme, createTestTranslator as mockCreateTestTranslator } from '@/test/test-utils';

import { TodoEditorModal } from './todo-editor-modal';

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

jest.mock('@/shared/components/date-picker-field', () => ({
  DatePickerField: ({ label, onChange, value }: { label: string; onChange: (value?: string) => void; value?: string }) => {
    return (
      <MockPressable accessibilityRole="button" onPress={() => onChange(value ? undefined : '2026-06-03')}>
        <MockText>{label}</MockText>
      </MockPressable>
    );
  },
}));

describe('TodoEditorModal', () => {
  it('keeps submit disabled until a title is entered', () => {
    const onSubmit = jest.fn();

    render(<TodoEditorModal dateFormat="dmy" visible onClose={jest.fn()} onSubmit={onSubmit} />);

    const submit = screen.getByRole('button', { name: 'Create task' });
    expect(submit.props.accessibilityState).toMatchObject({ disabled: true });

    fireEvent.press(submit);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits trimmed values and selected due date', () => {
    const onSubmit = jest.fn();

    render(<TodoEditorModal dateFormat="dmy" visible onClose={jest.fn()} onSubmit={onSubmit} />);

    fireEvent.changeText(screen.getByLabelText('Task title'), '  Pay rent  ');
    fireEvent.changeText(screen.getByLabelText('Description'), '  Before noon  ');
    fireEvent.press(screen.getByRole('button', { name: 'Due date' }));
    fireEvent.press(screen.getByRole('button', { name: 'Important' }));
    fireEvent.press(screen.getByRole('button', { name: 'Create task' }));

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Pay rent',
      description: 'Before noon',
      priority: 1,
      dueAt: '2026-06-03',
    });
  });

  it('hydrates edit mode from the existing todo', () => {
    const onSubmit = jest.fn();

    render(
      <TodoEditorModal
        dateFormat="dmy"
        visible
        onClose={jest.fn()}
        onSubmit={onSubmit}
        todo={{
          id: 'todo_1',
          title: 'Existing',
          description: 'Details',
          priority: 3,
          status: 'pending',
          dueAt: '2026-06-04',
          createdAt: '2026-06-01T00:00:00.000Z',
          updatedAt: '2026-06-01T00:00:00.000Z',
        }}
      />
    );

    fireEvent.press(screen.getByRole('button', { name: 'Save' }));

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Existing',
      description: 'Details',
      priority: 3,
      dueAt: '2026-06-04',
    });
  });
});
