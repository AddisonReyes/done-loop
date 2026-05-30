export type UserPlan = 'free' | 'no_ads' | 'premium';

export type UserThemePreference = 'system' | 'light' | 'dark';

export type UserSettings = {
  notificationsEnabled: boolean;
  theme: UserThemePreference;
  plan: UserPlan;
  privacyPolicyUrl?: string;
  termsUrl?: string;
};

export type UpdateUserSettingsInput = Partial<UserSettings>;
