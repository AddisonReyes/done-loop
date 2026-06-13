export const migration012AddLastActiveRouteSetting = {
  id: 12,
  name: 'add_last_active_route_setting',
  async up(database: import('expo-sqlite').SQLiteDatabase): Promise<void> {
    const columns = await database.getAllAsync<{ name: string }>('PRAGMA table_info(user_settings);');
    const hasLastActiveRoute = columns.some((column) => column.name === 'last_active_route');

    if (!hasLastActiveRoute) {
      await database.execAsync(`
        ALTER TABLE user_settings
        ADD COLUMN last_active_route TEXT NOT NULL DEFAULT '/habits';
      `);
    }
  },
};
