# Done Loop Play Store Checklist

## App Identity

- App name: Done Loop
- Android package: `com.addisonreyes.doneloop`
- Version: `1.0.0`
- Version code: `1`
- Current release target: Android first

## Assets

- [x] Final app icon configured
- [x] Adaptive Android icon configured
- [x] Splash screen configured
- [x] Notification icon configured
- [ ] Phone screenshots
- [ ] Feature graphic if needed

## Store Listing

- [ ] Short description
- [ ] Long description
- [x] Privacy policy URL: `https://done-loop.pages.dev/privacy`
- [x] Terms URL: `https://done-loop.pages.dev/terms`
- [x] Source code URL in app: `https://github.com/AddisonReyes/done-loop`
- [ ] Content rating questionnaire
- [ ] Data Safety form
- [ ] Declare app has no ads
- [ ] Declare app has no in-app purchases or subscriptions

## Permissions

- Notifications: used for local habit and task reminders.
- SQLite/local storage: stores user habits, task history, settings, and completion history locally.
- No backend, login, cloud sync, ads, analytics, memberships, subscriptions, or payments are implemented.

## EAS Build

Recommended next setup:

```sh
npx eas-cli build:configure
npx eas-cli build --platform android --profile preview
```

Before production:

- [ ] Create `eas.json` profiles for development, preview, and production.
- [ ] Generate an Android App Bundle.
- [ ] Test internal release on Google Play Console.
- [ ] Confirm the Play Console store listing shows no ads and no paid products.
