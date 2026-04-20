# EasyToDo

Local habit tracker + todo list.

## Features

- Habits reset daily.
- Habit history is shown for the current month only.
- Completing a todo deletes it.
- Runs fully client-side; data is stored in your browser `localStorage`.
- Dark theme only.

## Tech

- Next.js 16.2.4 (App Router)
- React 19
- Tailwind CSS v4

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Useful Commands

- Lint: `npm run lint`
- Typecheck: `npx tsc -p tsconfig.json --noEmit`
- Build: `npm run build`
- Start production server: `npm run start`

## Data Storage

State is persisted to `localStorage` under these keys:

- `easyToDo.habits`
- `easyToDo.todos`
- `easyToDo.habitHistory`
- `easyToDo.lastSeen`
