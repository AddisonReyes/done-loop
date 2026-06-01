# Mobile App Guidance

These instructions apply to the Expo React Native app in this directory.

## Current Stack

- Expo SDK 54.
- React 19.
- React Native 0.81.
- Expo Router.
- TypeScript.
- SQLite local-first persistence.
- Local notifications for habit and task reminders.

Before relying on Expo behavior, read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/.

## Product Constraints

- Done Loop is free, local-first, and open source.
- Do not add ads, memberships, subscriptions, in-app purchases, analytics, login, cloud sync, or backend dependencies unless the product direction explicitly changes.
- Treat user data as local, user-owned data. Any persisted shape change needs compatibility handling or a safe migration.
- Keep privacy, terms, and source-code links available from Settings.

## Validation

For mobile changes, prefer:

```bash
npm run typecheck
npm run lint
npm run test
```

Use the smallest relevant subset for docs-only or narrowly scoped changes, and document anything not run.
