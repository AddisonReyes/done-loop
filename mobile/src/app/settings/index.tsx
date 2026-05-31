import Constants from 'expo-constants';
import { Pressable, StyleSheet, Switch, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useSettings } from '@/features/settings/hooks/use-settings';
import type {
  UserDateFormatPreference,
  UserLanguagePreference,
  UserThemePreference,
} from '@/features/settings/types';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/i18n';
import { DropdownSelect } from '@/shared/components/dropdown-select';
import { ScreenScaffold } from '@/shared/components/screen-scaffold';
import { SectionCard } from '@/shared/components/section-card';
import { SegmentedControl } from '@/shared/components/segmented-control';

const themeOptions: { value: UserThemePreference; labelKey: string }[] = [
  { value: 'system', labelKey: 'settings.theme.system' },
  { value: 'light', labelKey: 'settings.theme.light' },
  { value: 'dark', labelKey: 'settings.theme.dark' },
];

const languageOptions: { value: UserLanguagePreference; labelKey: string }[] = [
  { value: 'en', labelKey: 'settings.language.en' },
  { value: 'es', labelKey: 'settings.language.es' },
];

const dateFormatOptions: { value: UserDateFormatPreference; labelKey: string }[] = [
  { value: 'iso', labelKey: 'settings.dateFormat.iso' },
  { value: 'mdy', labelKey: 'settings.dateFormat.mdy' },
  { value: 'dmy', labelKey: 'settings.dateFormat.dmy' },
  { value: 'long', labelKey: 'settings.dateFormat.long' },
];

export default function SettingsScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { isLoading, settings, setDateFormat, setLanguage, setNotificationsEnabled, setTheme } = useSettings();
  return (
    <ScreenScaffold title={t('settings.title')}>
      {isLoading || !settings ? (
        <ThemedText type="small" themeColor="textSecondary">
          {t('settings.loading')}
        </ThemedText>
      ) : (
        <>
          <SectionCard title={t('settings.preferences')}>
            <Pressable
              accessibilityRole="switch"
              accessibilityState={{ checked: settings.notificationsEnabled }}
              onPress={() => void setNotificationsEnabled(!settings.notificationsEnabled)}
              style={[
                styles.row,
                {
                  borderColor: settings.notificationsEnabled ? theme.borderStrong : theme.border,
                  backgroundColor: settings.notificationsEnabled ? theme.accentSoft : theme.surfaceSoft,
                },
              ]}>
              <View>
                <ThemedText type="smallBold">{t('settings.notifications')}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {t('settings.notificationDetail')}
                </ThemedText>
              </View>
              <Switch
                value={settings.notificationsEnabled}
                onValueChange={(enabled) => void setNotificationsEnabled(enabled)}
              />
            </Pressable>

            <SegmentedControl
              value={settings.theme}
              onChange={(value) => void setTheme(value)}
              options={themeOptions.map((option) => ({ value: option.value, label: t(option.labelKey) }))}
            />
          </SectionCard>

          <SectionCard title={t('settings.language.section')}>
            <SegmentedControl
              value={settings.language}
              onChange={(value) => void setLanguage(value)}
              options={languageOptions.map((option) => ({ value: option.value, label: t(option.labelKey) }))}
            />
          </SectionCard>

          <SectionCard title={t('settings.dateFormat.section')}>
            <DropdownSelect
              label={t('settings.dateFormat.section')}
              value={settings.dateFormat}
              onChange={(value) => void setDateFormat(value)}
              options={dateFormatOptions.map((option) => ({ value: option.value, label: t(option.labelKey) }))}
            />
          </SectionCard>

          <SectionCard title={t('settings.information')}>
            <InfoRow label={t('settings.version')} value={Constants.expoConfig?.version ?? '1.0.0'} />
            <InfoRow label={t('settings.privacy')} value={settings.privacyPolicyUrl ?? t('settings.pending')} />
            <InfoRow label={t('settings.terms')} value={settings.termsUrl ?? t('settings.pending')} />
          </SectionCard>
        </>
      )}
    </ScreenScaffold>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
      <ThemedText type="smallBold">{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 68,
    borderWidth: 1,
    borderRadius: 18,
    padding: Spacing.three,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
  infoRow: {
    minHeight: 36,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
});
