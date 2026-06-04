import { act, renderHook, waitFor } from '@testing-library/react-native';

import { SettingsRepository } from '@/features/settings/repositories/settings-repository';
import { setNotificationsEnabledPreferenceAsync } from '@/features/settings/services/notification-settings';

import { useSettings } from './use-settings';

const mockSetAccentColorPreference = jest.fn();
const mockSetAnimationsEnabledPreference = jest.fn();
const mockSetAppBackgroundPreference = jest.fn();
const mockSetLanguage = jest.fn();
const mockSetThemePreference = jest.fn();

jest.mock('@/hooks/use-theme-preference', () => ({
  useThemePreference: () => ({
    accentColor: 'green',
    animationsEnabled: false,
    appBackground: 'grid',
    preference: 'dark',
    setAccentColorPreference: mockSetAccentColorPreference,
    setAnimationsEnabledPreference: mockSetAnimationsEnabledPreference,
    setAppBackgroundPreference: mockSetAppBackgroundPreference,
    setThemePreference: mockSetThemePreference,
  }),
}));

jest.mock('@/i18n', () => ({
  useTranslation: () => ({
    language: 'es',
    setLanguage: mockSetLanguage,
  }),
}));

jest.mock('@/features/settings/repositories/settings-repository', () => ({
  SettingsRepository: {
    get: jest.fn(),
    update: jest.fn(),
  },
}));

jest.mock('@/features/settings/services/notification-settings', () => ({
  setNotificationsEnabledPreferenceAsync: jest.fn(),
}));

const storedSettings = {
  animationsEnabled: true,
  accentColor: 'purple' as const,
  appBackground: 'none' as const,
  dateFormat: 'dmy' as const,
  language: 'en' as const,
  notificationsEnabled: false,
  privacyPolicyUrl: 'https://done-loop.com/privacy',
  termsUrl: 'https://done-loop.pages.dev/terms',
  theme: 'system' as const,
};

describe('useSettings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(SettingsRepository.get).mockResolvedValue(storedSettings);
    jest.mocked(SettingsRepository.update).mockImplementation(async (input) => ({
      ...storedSettings,
      ...input,
    }));
    jest.mocked(setNotificationsEnabledPreferenceAsync).mockImplementation(async (enabled) => ({
      ...storedSettings,
      notificationsEnabled: enabled,
    }));
  });

  it('loads settings and overlays live theme/language preferences', async () => {
    const { result } = renderHook(() => useSettings());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.settings).toMatchObject({
      accentColor: 'green',
      animationsEnabled: false,
      appBackground: 'grid',
      dateFormat: 'dmy',
      language: 'es',
      theme: 'dark',
    });
  });

  it('updates date format through the settings repository', async () => {
    const { result } = renderHook(() => useSettings());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.setDateFormat('long');
    });

    expect(SettingsRepository.update).toHaveBeenCalledWith({ dateFormat: 'long' });
    expect(result.current.settings?.dateFormat).toBe('long');
  });

  it('delegates notification toggles with the active language', async () => {
    const { result } = renderHook(() => useSettings());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.setNotificationsEnabled(true);
    });

    expect(setNotificationsEnabledPreferenceAsync).toHaveBeenCalledWith(true, 'es');
    expect(result.current.settings?.notificationsEnabled).toBe(true);
  });

  it('delegates visual and language preferences to their providers', async () => {
    const { result } = renderHook(() => useSettings());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.setTheme('light');
      await result.current.setAccentColor('blue');
      await result.current.setAppBackground('solar');
      await result.current.setAnimationsEnabled(true);
      await result.current.setLanguage('en');
    });

    expect(mockSetThemePreference).toHaveBeenCalledWith('light');
    expect(mockSetAccentColorPreference).toHaveBeenCalledWith('blue');
    expect(mockSetAppBackgroundPreference).toHaveBeenCalledWith('solar');
    expect(mockSetAnimationsEnabledPreference).toHaveBeenCalledWith(true);
    expect(mockSetLanguage).toHaveBeenCalledWith('en');
  });
});
