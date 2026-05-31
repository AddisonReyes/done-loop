import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs, TabList, TabSlot, TabTrigger, TabTriggerSlotProps, TabListProps } from 'expo-router/ui';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/i18n';

type TabIconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

const iconByRoute: Record<string, TabIconName> = {
  habits: 'checkbox-marked-circle-outline',
  todos: 'format-list-checks',
  calendar: 'calendar',
  settings: 'cog-outline',
};

export default function AppTabs() {
  const { t } = useTranslation();

  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="habits" href="/habits" asChild>
            <TabButton label={t('tabs.habits')} iconName={iconByRoute.habits} />
          </TabTrigger>
          <TabTrigger name="todos" href="/todos" asChild>
            <TabButton label={t('tabs.todos')} iconName={iconByRoute.todos} />
          </TabTrigger>
          <TabTrigger name="calendar" href="/calendar" asChild>
            <TabButton label={t('tabs.calendar')} iconName={iconByRoute.calendar} />
          </TabTrigger>
          <TabTrigger name="settings" href="/settings" asChild>
            <TabButton label={t('tabs.settings')} iconName={iconByRoute.settings} />
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({
  label,
  iconName,
  isFocused,
  ...props
}: TabTriggerSlotProps & { label: string; iconName: TabIconName }) {
  const theme = useTheme();

  return (
    <Pressable
      {...props}
      accessibilityLabel={label}
      style={({ pressed }) => [styles.tabButton, pressed && styles.pressed]}>
      <View
        style={[
          styles.tabButtonView,
          {
            backgroundColor: isFocused ? theme.accentSoft : 'transparent',
            borderColor: isFocused ? theme.borderStrong : 'transparent',
          },
        ]}>
        <MaterialCommunityIcons
          name={iconName}
          size={24}
          color={isFocused ? theme.accentStrong : theme.textSecondary}
        />
      </View>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      {...props}
      style={[styles.tabListContainer, { paddingBottom: Math.max(insets.bottom, Spacing.three) }]}>
      <View
        style={[
          styles.innerContainer,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: theme.border,
            shadowColor: theme.glow,
          },
        ]}>
        {props.children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    alignItems: 'center',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: Spacing.two,
    position: 'absolute',
    width: '100%',
  },
  innerContainer: {
    alignItems: 'center',
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: 'row',
    gap: Spacing.one,
    justifyContent: 'space-around',
    minHeight: 56,
    paddingHorizontal: Spacing.one,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    width: '100%',
  },
  tabButton: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  tabButtonView: {
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 1,
    height: 46,
    justifyContent: 'center',
    width: 58,
  },
  pressed: {
    opacity: 0.72,
  },
});
