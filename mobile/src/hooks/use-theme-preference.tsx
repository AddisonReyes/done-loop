import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

import { SettingsRepository } from '@/features/settings/repositories/settings-repository';
import type {
  UserAccentColorPreference,
  UserAppBackgroundPreference,
  UserThemePreference,
} from '@/features/settings/types';

type ResolvedTheme = 'light' | 'dark';

type ThemePreferenceContextValue = {
  preference: UserThemePreference;
  accentColor: UserAccentColorPreference;
  appBackground: UserAppBackgroundPreference;
  animationsEnabled: boolean;
  resolvedTheme: ResolvedTheme;
  isLoadingTheme: boolean;
  setThemePreference: (preference: UserThemePreference) => Promise<void>;
  setAccentColorPreference: (accentColor: UserAccentColorPreference) => Promise<void>;
  setAppBackgroundPreference: (appBackground: UserAppBackgroundPreference) => Promise<void>;
  setAnimationsEnabledPreference: (enabled: boolean) => Promise<void>;
};

const ThemePreferenceContext = createContext<ThemePreferenceContextValue | null>(null);

function resolveTheme(preference: UserThemePreference, systemTheme: string | null | undefined): ResolvedTheme {
  if (preference === 'light' || preference === 'dark') {
    return preference;
  }

  return systemTheme === 'dark' ? 'dark' : 'light';
}

export function ThemePreferenceProvider({ children }: PropsWithChildren) {
  const systemTheme = useSystemColorScheme();
  const [preference, setPreference] = useState<UserThemePreference>('system');
  const [accentColor, setAccentColor] = useState<UserAccentColorPreference>('purple');
  const [appBackground, setAppBackground] = useState<UserAppBackgroundPreference>('none');
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [isLoadingTheme, setIsLoadingTheme] = useState(true);
  const resolvedTheme = resolveTheme(preference, systemTheme);

  useEffect(() => {
    let mounted = true;

    const loadPreference = async () => {
      const settings = await SettingsRepository.get();

      if (mounted) {
        setPreference(settings.theme);
        setAccentColor(settings.accentColor);
        setAppBackground(settings.appBackground);
        setAnimationsEnabled(settings.animationsEnabled);
        setIsLoadingTheme(false);
      }
    };

    void loadPreference();

    return () => {
      mounted = false;
    };
  }, []);

  const setThemePreference = useCallback(async (nextPreference: UserThemePreference) => {
    const nextSettings = await SettingsRepository.update({ theme: nextPreference });
    setPreference(nextSettings.theme);
  }, []);

  const setAccentColorPreference = useCallback(async (nextAccentColor: UserAccentColorPreference) => {
    const nextSettings = await SettingsRepository.update({ accentColor: nextAccentColor });
    setAccentColor(nextSettings.accentColor);
  }, []);

  const setAppBackgroundPreference = useCallback(async (nextAppBackground: UserAppBackgroundPreference) => {
    const nextSettings = await SettingsRepository.update({ appBackground: nextAppBackground });
    setAppBackground(nextSettings.appBackground);
  }, []);

  const setAnimationsEnabledPreference = useCallback(async (nextAnimationsEnabled: boolean) => {
    const nextSettings = await SettingsRepository.update({ animationsEnabled: nextAnimationsEnabled });
    setAnimationsEnabled(nextSettings.animationsEnabled);
  }, []);

  const value = useMemo(
    () => ({
      preference,
      accentColor,
      appBackground,
      animationsEnabled,
      resolvedTheme,
      isLoadingTheme,
      setThemePreference,
      setAccentColorPreference,
      setAppBackgroundPreference,
      setAnimationsEnabledPreference,
    }),
    [
      accentColor,
      animationsEnabled,
      appBackground,
      isLoadingTheme,
      preference,
      resolvedTheme,
      setAppBackgroundPreference,
      setAnimationsEnabledPreference,
      setAccentColorPreference,
      setThemePreference,
    ]
  );

  return <ThemePreferenceContext.Provider value={value}>{children}</ThemePreferenceContext.Provider>;
}

export function useThemePreference() {
  const value = useContext(ThemePreferenceContext);

  if (!value) {
    throw new Error('useThemePreference must be used inside ThemePreferenceProvider');
  }

  return value;
}
