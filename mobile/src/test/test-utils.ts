import { Colors } from '@/constants/theme';
import { translations } from '@/i18n/translations';

export const mockTheme = {
  ...Colors.light,
  accent: '#8B5CF6',
  accentSoft: 'rgba(139, 92, 246, 0.14)',
  accentStrong: '#6D28D9',
  borderStrong: '#D7C8F7',
  historyEmpty: '#FFFFFF',
  historyPartial: 'rgba(168, 85, 247, 0.34)',
  historyComplete: '#A855F7',
};

type TranslationParams = Record<string, string | number>;

export function createTestTranslator(language: keyof typeof translations = 'en') {
  return (key: string, params?: TranslationParams) => {
    const segments = key.split('.');
    let value: unknown = translations[language];

    for (const segment of segments) {
      if (!value || typeof value !== 'object' || !(segment in value)) {
        return key;
      }

      value = (value as Record<string, unknown>)[segment];
    }

    const template = typeof value === 'string' ? value : key;
    return template.replace(/\{\{(\w+)\}\}/g, (_, paramKey: string) => String(params?.[paramKey] ?? ''));
  };
}
