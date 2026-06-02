import { act, render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { SegmentedControl } from './segmented-control';

jest.mock('@/hooks/use-theme', () => ({
  useTheme: () => ({
    accentStrong: '#111111',
    backgroundElement: '#ffffff',
    backgroundSelected: '#eeeeee',
    border: '#dddddd',
    textSecondary: '#777777',
  }),
}));

let mockAnimationsEnabled = false;

jest.mock('@/hooks/use-theme-preference', () => ({
  useThemePreference: () => ({
    animationsEnabled: mockAnimationsEnabled,
  }),
}));

describe('SegmentedControl', () => {
  beforeEach(() => {
    mockAnimationsEnabled = false;
  });

  it('keeps the selected indicator aligned when animations are disabled', () => {
    const options = [
      { label: 'Priority', value: 'priority' },
      { label: 'Date', value: 'dueAt' },
      { label: 'Created', value: 'createdAt' },
    ];
    const { rerender, UNSAFE_getByProps } = render(
      <SegmentedControl value="priority" onChange={jest.fn()} options={options} />
    );

    const root = screen.getByTestId('segmented-control');
    act(() => {
      root.props.onLayout({ nativeEvent: { layout: { width: 304 } } });
    });

    rerender(<SegmentedControl value="dueAt" onChange={jest.fn()} options={options} />);

    const indicator = UNSAFE_getByProps({ pointerEvents: 'none' });
    const indicatorStyle = StyleSheet.flatten(indicator.props.style);

    expect(indicatorStyle?.transform).toEqual([{ translateX: 100 }]);
    expect(indicatorStyle?.width).toBe(100);
  });

  it('renders safely with no options', () => {
    render(<SegmentedControl value="" onChange={jest.fn()} options={[]} />);

    expect(screen.toJSON()).toBeTruthy();
  });
});
