# Done Loop

Done Loop is a free, open source, local-first productivity app for habits, tasks, calendar context, reminders, and lightweight daily planning. The current product focus is the Expo React Native app in `mobile/`, with a production-facing website in `website/`.

Done Loop has no ads, memberships, subscriptions, in-app purchases, analytics, account system, backend, or cloud sync. App data is stored locally on the user's device.

## Features

- Habit tracking with daily completion, reminders, filters, and monthly history.
- Task management with priorities, due dates, completion, reopening, editing, and deletion.
- Calendar view that combines habit activity and dated tasks.
- Local notifications for habit and task reminders.
- Local-first data storage powered by SQLite.
- App settings for notifications, language, date format, theme, and visual personalization.
- Theme modes: system, light, and dark.
- App color personalization: purple, blue, green, red, yellow, and pink.
- English and Spanish localization.
- Fraunces typography applied across the app.
- Privacy, terms, and source-code links available from the app settings.

## Project Structure

- `mobile/` - Expo React Native app for Android, iOS, and Expo-supported development workflows.
- `website/` - Next.js App Router marketing and legal website for Done Loop.

## Mobile Tech Stack

- Expo 54
- React 19
- React Native 0.81
- Expo Router
- TypeScript
- Expo SQLite
- Expo Notifications
- Expo Font

## Getting Started

Install and run the mobile app:

```bash
cd mobile
npm install
npm run start
```

You can also run the Android helper script:

```bash
cd mobile
npm run dev
```

## Mobile Commands

Run these from `mobile/`:

```bash
npm run start
npm run android
npm run typecheck
npm run lint
npm run test
```

## Data Storage

The mobile app stores user data locally in SQLite. The database includes habits, habit completions, tasks, and user settings. Migrations live in `mobile/src/storage/migrations`.

User settings currently include:

- Notifications enabled
- Theme preference
- Accent color
- Language
- Date format
- Privacy policy URL
- Terms URL

## Design Notes

Done Loop uses a calm, card-based mobile UI with light and dark themes. The accent system updates primary actions, selected states, borders, and habit history colors across the app. Fraunces is bundled locally and loaded through Expo Font.

## Website

The `website/` directory contains the production-facing landing and legal pages:

```bash
cd website
npm install
npm run dev
```

Run website checks with:

```bash
cd website
npm run test
npm run lint
npm run build
```

The website is deployed at <https://done-loop.pages.dev/>.

## Legal And Source

- Privacy Policy: <https://done-loop.com/privacy>
- Terms of Service: <https://done-loop.pages.dev/terms>
- Source code: <https://github.com/AddisonReyes/done-loop>
- License: MIT, see `LICENSE`.
