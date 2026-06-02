import { openDatabaseAsync } from 'expo-sqlite';

import { runMigrationsAsync } from '@/storage/migrations';

import { getDatabaseAsync, resetDatabaseConnectionForTestsAsync } from './client';

jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(),
}));

jest.mock('@/storage/migrations', () => ({
  runMigrationsAsync: jest.fn(),
}));

const mockedOpenDatabaseAsync = jest.mocked(openDatabaseAsync);
const mockedRunMigrationsAsync = jest.mocked(runMigrationsAsync);

function createDatabase() {
  return {
    closeAsync: jest.fn(async () => undefined),
    execAsync: jest.fn(async () => undefined),
  };
}

describe('getDatabaseAsync', () => {
  afterEach(async () => {
    jest.clearAllMocks();
    await resetDatabaseConnectionForTestsAsync();
  });

  it('clears the cached initialization promise after a migration failure', async () => {
    const failedDatabase = createDatabase();
    const recoveredDatabase = createDatabase();

    mockedOpenDatabaseAsync
      .mockResolvedValueOnce(failedDatabase as never)
      .mockResolvedValueOnce(recoveredDatabase as never);
    mockedRunMigrationsAsync
      .mockRejectedValueOnce(new Error('migration failed'))
      .mockResolvedValueOnce(undefined);

    await expect(getDatabaseAsync()).rejects.toThrow('migration failed');
    await expect(getDatabaseAsync()).resolves.toBe(recoveredDatabase);

    expect(mockedOpenDatabaseAsync).toHaveBeenCalledTimes(2);
    expect(recoveredDatabase.execAsync).toHaveBeenCalledWith('PRAGMA foreign_keys = ON;');
  });
});
