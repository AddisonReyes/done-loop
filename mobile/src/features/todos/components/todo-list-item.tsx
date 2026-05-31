import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/i18n';
import type { Todo } from '@/features/todos/types';

type TodoListItemProps = {
  todo: Todo;
  dateLabel: string;
  onComplete: () => void;
  onReopen: () => void;
  onSoftDelete: () => void;
  onRestore: () => void;
  onPermanentDelete: () => void;
  onStartEdit?: () => void;
};

const priorityLabelKeys = {
  1: 'todos.priorities.1',
  2: 'todos.priorities.2',
  3: 'todos.priorities.3',
} as const;

export function TodoListItem({
  todo,
  dateLabel,
  onComplete,
  onReopen,
  onSoftDelete,
  onRestore,
  onPermanentDelete,
  onStartEdit,
}: TodoListItemProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const deleted = todo.status === 'deleted';
  const completed = todo.status === 'completed';

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: completed ? theme.borderStrong : theme.border,
          backgroundColor: completed ? theme.accentSoft : theme.backgroundElement,
        },
      ]}>
      <View style={styles.header}>
        <ThemedText type="smallBold" style={completed && styles.completedText}>
          {todo.title}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {t(priorityLabelKeys[todo.priority])} • {dateLabel}
        </ThemedText>
      </View>

      <View style={styles.actions}>
        {deleted ? (
          <>
            <Action label={t('todos.actions.restore')} onPress={onRestore} />
            <Action label={t('todos.actions.permanentDelete')} muted onPress={onPermanentDelete} />
          </>
        ) : (
          <>
            <Action
              label={completed ? t('todos.actions.reopen') : t('todos.actions.complete')}
              onPress={completed ? onReopen : onComplete}
            />
            {onStartEdit ? <Action label={t('todos.actions.edit')} muted onPress={onStartEdit} /> : null}
            <Action label={t('todos.actions.delete')} muted onPress={onSoftDelete} />
          </>
        )}
      </View>
    </View>
  );
}

function Action({ label, muted, onPress }: { label: string; muted?: boolean; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.action,
        {
          backgroundColor: muted ? theme.backgroundSelected : theme.accentSoft,
          borderColor: muted ? theme.border : theme.borderStrong,
        },
      ]}>
      <ThemedText type="smallBold" themeColor={muted ? 'textSecondary' : 'accentStrong'}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 18,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  header: {
    gap: Spacing.one,
  },
  completedText: {
    textDecorationLine: 'line-through',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  action: {
    minHeight: 40,
    borderWidth: 1,
    borderRadius: 14,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
});
