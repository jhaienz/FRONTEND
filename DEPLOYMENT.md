# Frontend Deployment

Deploy `FRONTEND/` as its own Vercel project. Vercel should detect Next.js and pnpm from `pnpm-lock.yaml`.

## Vercel Settings

- Framework preset: Next.js.
- Install command: `pnpm install --frozen-lockfile`.
- Build command: `pnpm build`.
- Output directory: leave as Vercel default.

## Required Environment Variables

- `NEXT_PUBLIC_API_URL`: deployed backend origin, for example `https://your-backend.onrender.com`.

Do not include `/api`; the frontend appends `/api` internally.

## Backend CORS Pairing

Set the backend `FRONTEND_URL` to the exact Vercel origin, for example `https://your-app.vercel.app`.

## After Deploy

- Open `/login` and confirm the page loads.
- Open `/api/backend/analytics/user/overview` while logged out and confirm it returns `401`.
- Open `/dashboard` while logged out and confirm it redirects to `/login`.
