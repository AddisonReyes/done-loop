# Done Loop Website

Production-facing marketing and legal website for Done Loop, built with Next.js App Router and Tailwind CSS.

The website presents Done Loop as a published free mobile app: no ads, memberships, subscriptions, in-app purchases, analytics, account system, backend, or cloud sync.

## Getting Started

Run from `website/`:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Commands

```bash
npm run lint
npm run build
npm run test
```

## Notes

- The site is marketing/legal-only and does not include auth, analytics, forms, or app data.
- English is the default copy, with Spanish selectable in the page header.
- The Google Play CTA uses an internal `#google-play` section until an external store URL is configured.
- Legal pages live at `/privacy` and `/terms`.
- The source code is published at https://github.com/AddisonReyes/done-loop.
