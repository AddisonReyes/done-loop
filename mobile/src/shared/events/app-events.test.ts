import { emitAppEvent, subscribeToAppEvent } from "./app-events";

describe("app events", () => {
  it("notifies subscribers and supports unsubscribe", () => {
    const listener = jest.fn();
    const unsubscribe = subscribeToAppEvent("habitsChanged", listener);

    emitAppEvent("habitsChanged");
    unsubscribe();
    emitAppEvent("habitsChanged");

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("keeps different event names isolated", () => {
    const listener = jest.fn();
    const unsubscribe = subscribeToAppEvent("todosChanged", listener);

    emitAppEvent("habitsChanged");
    unsubscribe();

    expect(listener).not.toHaveBeenCalled();
  });
});
