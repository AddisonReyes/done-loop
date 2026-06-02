import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { NotificationService } from '@/features/notifications/services/notification-service';
import { rescheduleExistingRemindersAsync } from '@/features/settings/services/notification-settings';
import AppTabs from '@/components/app-tabs';
import { ThemePreferenceProvider, useThemePreference } from '@/hooks/use-theme-preference';
import { I18nProvider } from '@/i18n';
import { configureDefaultFonts } from '@/shared/utils/configure-default-fonts';
import { SettingsRepository } from '@/features/settings/repositories/settings-repository';

configureDefaultFonts();

export default function TabLayout() {
  return (
    <ThemePreferenceProvider>
      <I18nProvider>
        <ThemedNavigation />
      </I18nProvider>
    </ThemePreferenceProvider>
  );
}

function ThemedNavigation() {
  const { animationsEnabled, isLoadingTheme, resolvedTheme } = useThemePreference();
  const [fontsLoaded, fontError] = useFonts({
    'Fraunces-Bold': require('@/assets/fonts/Fraunces-Bold.ttf'),
    'Fraunces-Medium': require('@/assets/fonts/Fraunces-Medium.ttf'),
    'Fraunces-SemiBold': require('@/assets/fonts/Fraunces-SemiBold.ttf'),
  });

  useEffect(() => {
    void NotificationService.configureForegroundHandlingAsync();
    void NotificationService.configureResponseHandlingAsync();
    NotificationService.configureAppStateSync(() => {
      void SettingsRepository.get().then((settings) => {
        if (settings.notificationsEnabled) {
          return rescheduleExistingRemindersAsync(settings.language).catch(() => undefined);
        }
        return undefined;
      });
    });
  }, []);

  return (
    <ThemeProvider value={resolvedTheme === 'dark' ? DarkTheme : DefaultTheme}>
      {!isLoadingTheme && animationsEnabled ? <AnimatedSplashOverlay animationsEnabled={animationsEnabled} /> : null}
      {fontsLoaded || fontError ? <AppTabs /> : null}
    </ThemeProvider>
  );
}
