import type { SQLiteDatabase } from 'expo-sqlite';

export const migration009AddSolarAppBackground = {
  id: 9,
  name: 'add_solar_app_background',
  async up(database: SQLiteDatabase): Promise<void> {
    await database.execAsync(`
      DROP TABLE IF EXISTS user_settings_next;

      CREATE TABLE user_settings_next (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        notifications_enabled INTEGER NOT NULL CHECK (notifications_enabled IN (0, 1)),
        animations_enabled INTEGER NOT NULL DEFAULT 1 CHECK (animations_enabled IN (0, 1)),
        theme TEXT NOT NULL CHECK (theme IN ('system', 'light', 'dark')),
        accent_color TEXT NOT NULL DEFAULT 'purple' CHECK (accent_color IN ('purple', 'blue', 'green', 'red', 'yellow', 'pink')),
        app_background TEXT NOT NULL DEFAULT 'none' CHECK (app_background IN ('none', 'gradient', 'grid', 'solar')),
        language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'es')),
        date_format TEXT NOT NULL DEFAULT 'dmy' CHECK (date_format IN ('iso', 'mdy', 'dmy', 'long')),
        plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free')),
        privacy_policy_url TEXT,
        terms_url TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      INSERT OR REPLACE INTO user_settings_next (
        id,
        notifications_enabled,
        animations_enabled,
        theme,
        accent_color,
        app_background,
        language,
        date_format,
        plan,
        privacy_policy_url,
        terms_url,
        created_at,
        updated_at
      )
      SELECT
        id,
        notifications_enabled,
        animations_enabled,
        theme,
        accent_color,
        app_background,
        language,
        date_format,
        plan,
        privacy_policy_url,
        terms_url,
        created_at,
        updated_at
      FROM user_settings;

      DROP TABLE user_settings;
      ALTER TABLE user_settings_next RENAME TO user_settings;
    `);
  },
} as const;
