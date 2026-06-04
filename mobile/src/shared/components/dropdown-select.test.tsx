import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text as MockText } from 'react-native';

import { mockTheme } from '@/test/test-utils';

import { DropdownSelect } from './dropdown-select';

jest.mock('@/hooks/use-theme', () => ({
  useTheme: () => mockTheme,
}));

jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: ({ name }: { name: string }) => {
    return <MockText>{name}</MockText>;
  },
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ bottom: 0, left: 0, right: 0, top: 0 }),
}));

describe('DropdownSelect', () => {
  it('opens options and reports the selected value', () => {
    const onChange = jest.fn();

    render(
      <DropdownSelect
        label="Theme"
        value="system"
        onChange={onChange}
        options={[
          { label: 'System', value: 'system' },
          { label: 'Light', value: 'light' },
          { label: 'Dark', value: 'dark' },
        ]}
      />
    );

    fireEvent.press(screen.getByRole('button', { name: 'Theme' }));
    fireEvent.press(screen.getByText('Dark'));

    expect(onChange).toHaveBeenCalledWith('dark');
  });

  it('marks the current option selected for accessibility', () => {
    render(
      <DropdownSelect
        label="Theme"
        value="dark"
        onChange={jest.fn()}
        options={[
          { label: 'System', value: 'system' },
          { label: 'Dark', value: 'dark' },
        ]}
      />
    );

    fireEvent.press(screen.getByRole('button', { name: 'Theme' }));

    expect(
      screen.getAllByRole('button').some((button) => button.props.accessibilityState?.selected === true)
    ).toBe(true);
  });
});
