import type { SQLiteDatabase } from 'expo-sqlite';

export const migration011AddLocalDateKeys = {
  id: 11,
  name: 'add_local_date_keys',
  async up(database: SQLiteDatabase): Promise<void> {
    const habitColumns = await database.getAllAsync<{ name: string }>('PRAGMA table_info(habits);');
    const todoColumns = await database.getAllAsync<{ name: string }>('PRAGMA table_info(todos);');
    const habitColumnNames = new Set(habitColumns.map((column) => column.name));
    const todoColumnNames = new Set(todoColumns.map((column) => column.name));

    if (!habitColumnNames.has('start_date')) {
      await database.execAsync(`
        ALTER TABLE habits
        ADD COLUMN start_date TEXT;
      `);
      await database.execAsync(`
        UPDATE habits
        SET start_date = substr(created_at, 1, 10)
        WHERE start_date IS NULL
          AND created_at IS NOT NULL
          AND length(created_at) >= 10;
      `);
    }

    if (!todoColumnNames.has('completed_date')) {
      await database.execAsync(`
        ALTER TABLE todos
        ADD COLUMN completed_date TEXT;
      `);
      await database.execAsync(`
        UPDATE todos
        SET completed_date = substr(completed_at, 1, 10)
        WHERE completed_date IS NULL
          AND completed_at IS NOT NULL
          AND length(completed_at) >= 10;
      `);
    }
  },
} as const;
