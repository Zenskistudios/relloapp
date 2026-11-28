# RELLO

A notebook-inspired community journal, built with React, Vite and Supabase.

**Working now:** Google sign-in, a public newest-first journal, entries with text, one photo, a
category and location, and public profiles.

**Not built yet:** likes, comments, Confirmed, bookmarks, delete, report, profile editing,
video, Stories, follows, notifications and search. The database already has tables and security
rules for comments, reactions, bookmarks and reports.

## Setup

You need Node.js 22.12 or newer.

### 1. Create the database

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor**, paste all of [`supabase/schema.sql`](supabase/schema.sql) and run it once.
3. Do the same with [`supabase/photos.sql`](supabase/photos.sql).

### 2. Connect the app

```sh
cp .env.example .env.local
```

Fill in the project URL and the **publishable** key from the dashboard. Never use a secret or
`service_role` key in this app.

### 3. Turn on Google sign-in

1. In [Google Cloud Console](https://console.cloud.google.com), open **Google Auth Platform**,
   set up the consent screen, then create a client of type **Web application**.
2. Authorized JavaScript origins: `http://localhost:5173` (add your live address later).
3. Authorized redirect URI: copy the callback URL from Supabase under
   **Authentication > Providers > Google**. It ends in `/auth/v1/callback`.
4. Paste the Google client ID and secret into that Supabase page and enable the provider.
5. In Supabase **Authentication > URL Configuration**, set the Site URL to
   `http://localhost:5173` and add `http://localhost:5173/auth/callback` to the redirect URLs.
6. While the Google app is in testing mode, add each tester as a test user, or publish the app.

### 4. Run it

```sh
npm install
npm run dev
```

Open <http://localhost:5173> (use `localhost`, so it matches the addresses above).

## Deploy to Vercel

1. Import the repository in Vercel (framework preset: Vite).
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` as environment variables, then deploy.
3. In Supabase, change the Site URL to the live address and add
   `https://YOUR-DOMAIN/auth/callback` to the redirect URLs.
4. In Google, add `https://YOUR-DOMAIN` to the authorized JavaScript origins.

## Moderation, for now

In the Supabase **Table Editor**, read the `reports` table. To remove a post from public view, set
its `hidden_at` to the current time. If it has a photo, also delete that file under **Storage >
post-photos** (the post's `image_path` names it), because the photo's address keeps working until
you do.

## Photos

The app shrinks each photo to a JPEG under 1 MB before uploading it, which also removes the GPS
location a camera may store in the file. This happens in the browser, so someone bypassing the app
could upload a file with that data still in it. There is no daily upload limit yet.

## Check your work

```sh
npm run build
npm run lint
```

## Project layout

```
src/
  pages/        one file per screen
  components/   shared pieces
  auth/         session and Google sign-in
  lib/          Supabase client and data queries
  later/        original mock-up, not used by the app
supabase/
  schema.sql    tables and security rules
  photos.sql    photo uploads (run after schema.sql)
```
