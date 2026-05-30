import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Todo } from '@/features/todos/types';

type TodoListItemProps = {
  todo: Todo;
  editing: boolean;
  editingTitle: string;
  dateLabel: string;
  onEditingTitleChange: (value: string) => void;
  onComplete: () => void;
  onReopen: () => void;
  onSoftDelete: () => void;
  onRestore: () => void;
  onPermanentDelete: () => void;
  onStartEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
};

const priorityLabels = {
  1: 'Importante',
  2: 'Relevante',
  3: 'Sin importancia',
} as const;

export function TodoListItem({
  todo,
  editing,
  editingTitle,
  dateLabel,
  onEditingTitleChange,
  onComplete,
  onReopen,
  onSoftDelete,
  onRestore,
  onPermanentDelete,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
}: TodoListItemProps) {
  const theme = useTheme();
  const deleted = todo.status === 'deleted';
  const completed = todo.status === 'completed';

  return (
    <View style={[styles.container, { borderColor: theme.border }]}>
      <View style={styles.header}>
        {editing ? (
          <TextInput
            accessibilityLabel="Editar tarea"
            autoFocus
            value={editingTitle}
            onChangeText={onEditingTitleChange}
            onSubmitEditing={onSaveEdit}
            style={[styles.input, { borderColor: theme.border, color: theme.text }]}
          />
        ) : (
          <ThemedText type="smallBold" style={completed && styles.completedText}>
            {todo.title}
          </ThemedText>
        )}
        <ThemedText type="small" themeColor="textSecondary">
          {priorityLabels[todo.priority]} • {dateLabel}
        </ThemedText>
      </View>

      <View style={styles.actions}>
        {deleted ? (
          <>
            <Action label="Restaurar" onPress={onRestore} />
            <Action label="Borrar final" muted onPress={onPermanentDelete} />
          </>
        ) : editing ? (
          <>
            <Action label="Guardar" onPress={onSaveEdit} />
            <Action label="Cancelar" muted onPress={onCancelEdit} />
          </>
        ) : (
          <>
            <Action label={completed ? 'Reabrir' : 'Completar'} onPress={completed ? onReopen : onComplete} />
            <Action label="Editar" muted onPress={onStartEdit} />
            <Action label="Eliminar" muted onPress={onSoftDelete} />
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
      style={[styles.action, { backgroundColor: muted ? theme.backgroundSelected : theme.accentSoft }]}>
      <ThemedText type="smallBold" themeColor={muted ? 'textSecondary' : 'accent'}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 20,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  header: {
    gap: Spacing.one,
  },
  input: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: Spacing.two,
    fontSize: 16,
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
    minHeight: 36,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
});
