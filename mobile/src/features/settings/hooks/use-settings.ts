import { useCallback, useEffect, useState } from 'react';

import { NotificationService } from '@/features/notifications/services/notification-service';
import { SettingsRepository } from '@/features/settings/repositories/settings-repository';
import type { UserSettings, UserThemePreference } from '@/features/settings/types';

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    setSettings(await SettingsRepository.get());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      void loadSettings();
    }, 0);

    return () => clearTimeout(timeout);
  }, [loadSettings]);

  const setNotificationsEnabled = useCallback(
    async (enabled: boolean) => {
      const granted = enabled ? await NotificationService.requestPermissionsAsync() : false;
      setSettings(await SettingsRepository.update({ notificationsEnabled: enabled && granted }));
    },
    []
  );

  const setTheme = useCallback(async (theme: UserThemePreference) => {
    setSettings(await SettingsRepository.update({ theme }));
  }, []);

  return {
    isLoading,
    settings,
    setNotificationsEnabled,
    setTheme,
  };
}
