type AppEventName = 'habitsChanged' | 'todosChanged';
type AppEventListener = () => void;

const listenersByEvent = new Map<AppEventName, Set<AppEventListener>>();

export function emitAppEvent(eventName: AppEventName): void {
  listenersByEvent.get(eventName)?.forEach((listener) => {
    listener();
  });
}

export function subscribeToAppEvent(eventName: AppEventName, listener: AppEventListener): () => void {
  const listeners = listenersByEvent.get(eventName) ?? new Set<AppEventListener>();
  listeners.add(listener);
  listenersByEvent.set(eventName, listeners);

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      listenersByEvent.delete(eventName);
    }
  };
}
