# IELTS Focus

IELTS Academic preparation workspace. The interface defaults to Uzbek. This repository is in Phase 1: secure foundation, accounts, learner profile, Firebase rules, and emulator scaffolding.

## Local setup (PowerShell)

```powershell
Copy-Item .env.example .env.local
npm install
npm run dev
```

Create a Firebase project, add a Web app, and put its public web configuration in `.env.local`. Enable Email/Password in **Authentication → Sign-in method** and add `localhost` to authorized domains as needed. Public Firebase configuration is not a secret and does not grant access; rules and verified tokens do.

For server routes and scripts, set `FIREBASE_PROJECT_ID` and authenticate with Application Default Credentials. Locally, Firebase documents recommend:

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\secure\service-account.json"
$env:FIREBASE_PROJECT_ID="your-project-id"
node scripts/set-admin.mjs admin@example.com
```

Do not commit the service-account file. The user must sign out/in after receiving the admin claim.

## Emulators

Install the Firebase CLI, log in, then run `firebase init emulators` if local project metadata is absent, followed by `npx firebase-tools emulators:start`. Set `NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true` in `.env.local`. The client connects Auth and Firestore to localhost only when that flag is exactly `true`.

Deploy rules/indexes deliberately: `npx firebase-tools deploy --only firestore:rules,firestore:indexes,storage`. This is never run automatically by the app.

## Cost / Storage

Cloud Storage for Firebase may require a Blaze billing-enabled project. Configure budget alerts in Google Cloud, but alerts are notifications rather than a spending cap. The local emulator workflow needs no production billing.

## Security boundaries

- Admin authority is a Firebase custom claim only, never a profile field.
- Correct answers stay in `contentKeys`, inaccessible to learners.
- Private learner documents and recordings are owner-only in rules.
- Privileged server handlers verify Firebase ID tokens and use a Node runtime.

See `DATA_MODEL.md`, `firestore.rules`, `storage.rules`, and `IMPLEMENTATION_STATUS.md` for the current implementation boundary.
