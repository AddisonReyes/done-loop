import { createLocalId } from '@/storage/database/ids';
import { nullableString, optionalString } from '@/storage/database/sqlite-mappers';
import { getDatabaseAsync } from '@/storage/database/client';
import { isDateKey } from '@/shared/utils/date';

import type { CreateTodoInput, Todo, TodoPriority, TodoStatus, UpdateTodoInput } from '../types';

function toTodoPriority(value: TodoPriority): TodoPriority {
  return value === 1 || value === 2 || value === 3 ? value : 2;
}

function toTodoStatus(value: TodoStatus): TodoStatus {
  return value === 'pending' || value === 'completed' || value === 'deleted' ? value : 'pending';
}

type TodoRow = {
  id: string;
  title: string;
  description: string | null;
  priority: TodoPriority;
  status: TodoStatus;
  due_at: string | null;
  completed_at: string | null;
  completed_date?: string | null;
  deleted_at: string | null;
  notification_id: string | null;
  created_at: string;
  updated_at: string;
};

function mapTodoRow(row: TodoRow): Todo {
  return {
    id: row.id,
    title: row.title,
    description: optionalString(row.description),
    priority: toTodoPriority(row.priority),
    status: toTodoStatus(row.status),
    dueAt: isDateKey(row.due_at ?? undefined) ? row.due_at ?? undefined : undefined,
    completedAt: optionalString(row.completed_at),
    completedDate: isDateKey(row.completed_date ?? undefined) ? row.completed_date ?? undefined : undefined,
    deletedAt: optionalString(row.deleted_at),
    notificationId: optionalString(row.notification_id),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const TodoRepository = {
  async create(input: CreateTodoInput): Promise<Todo> {
    const database = await getDatabaseAsync();
    const now = new Date().toISOString();
    const todo: Todo = {
      id: createLocalId('todo'),
      title: input.title,
      description: input.description,
      priority: input.priority,
      status: 'pending',
      dueAt: input.dueAt,
      notificationId: input.notificationId,
      createdAt: now,
      updatedAt: now,
    };

    await database.runAsync(
      `INSERT INTO todos (
        id,
        title,
        description,
        priority,
        status,
        due_at,
        completed_at,
        completed_date,
        deleted_at,
        notification_id,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      todo.id,
      todo.title,
      nullableString(todo.description),
      todo.priority,
      todo.status,
      nullableString(todo.dueAt),
      nullableString(todo.completedAt),
      nullableString(todo.completedDate),
      nullableString(todo.deletedAt),
      nullableString(todo.notificationId),
      todo.createdAt,
      todo.updatedAt
    );

    return todo;
  },

  async listActive(): Promise<Todo[]> {
    const database = await getDatabaseAsync();
    const rows = await database.getAllAsync<TodoRow>(
      `SELECT * FROM todos
       WHERE status != 'deleted'
       ORDER BY created_at DESC;`
    );
    return rows.map(mapTodoRow);
  },

  async findById(id: string): Promise<Todo | null> {
    const database = await getDatabaseAsync();
    const row = await database.getFirstAsync<TodoRow>('SELECT * FROM todos WHERE id = ?;', id);
    return row ? mapTodoRow(row) : null;
  },

  async update(id: string, input: UpdateTodoInput): Promise<Todo | null> {
    const existing = await this.findById(id);
    if (!existing) {
      return null;
    }

    const database = await getDatabaseAsync();
    const next: Todo = {
      ...existing,
      ...input,
      updatedAt: new Date().toISOString(),
    };

    await database.runAsync(
      `UPDATE todos
       SET title = ?,
           description = ?,
           priority = ?,
           status = ?,
            due_at = ?,
            completed_at = ?,
            completed_date = ?,
            deleted_at = ?,
           notification_id = ?,
           updated_at = ?
       WHERE id = ?;`,
      next.title,
      nullableString(next.description),
      next.priority,
      next.status,
      nullableString(next.dueAt),
      nullableString(next.completedAt),
      nullableString(next.completedDate),
      nullableString(next.deletedAt),
      nullableString(next.notificationId),
      next.updatedAt,
      id
    );

    return next;
  },

  async deleteById(id: string): Promise<boolean> {
    const database = await getDatabaseAsync();
    const now = new Date().toISOString();
    const result = await database.runAsync(
      `UPDATE todos
       SET status = 'deleted', deleted_at = ?, updated_at = ?
       WHERE id = ?;`,
      now,
      now,
      id
    );
    return result.changes > 0;
  },

  async clearAllNotificationIds(): Promise<number> {
    const database = await getDatabaseAsync();
    const result = await database.runAsync(
      `UPDATE todos
       SET notification_id = NULL, updated_at = ?
       WHERE notification_id IS NOT NULL;`,
      new Date().toISOString()
    );
    return result.changes;
  },
};
