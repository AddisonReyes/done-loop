import type { SQLiteDatabase } from 'expo-sqlite';

export const migration006AddHabitNotificationId = {
  id: 6,
  name: 'add_habit_notification_id',
  async up(database: SQLiteDatabase): Promise<void> {
    const columns = await database.getAllAsync<{ name: string }>('PRAGMA table_info(habits);');
    const hasNotificationId = columns.some((column) => column.name === 'notification_id');

    if (!hasNotificationId) {
      await database.execAsync(`
        ALTER TABLE habits
        ADD COLUMN notification_id TEXT;
      `);
    }
  },
} as const;
