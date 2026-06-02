import type { SQLiteDatabase } from 'expo-sqlite';

export const migration008AddAnimationsEnabledSetting = {
  id: 8,
  name: 'add_animations_enabled_setting',
  async up(database: SQLiteDatabase): Promise<void> {
    const columns = await database.getAllAsync<{ name: string }>('PRAGMA table_info(user_settings);');
    const hasAnimationsEnabled = columns.some((column) => column.name === 'animations_enabled');

    if (!hasAnimationsEnabled) {
      await database.execAsync(`
        ALTER TABLE user_settings
        ADD COLUMN animations_enabled INTEGER NOT NULL DEFAULT 1
        CHECK (animations_enabled IN (0, 1));
      `);
    }
  },
} as const;
