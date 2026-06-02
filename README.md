# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Deployment and scheduled notifications

For the backend on Render, set these environment variables in the service configuration:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_NUMBER`
- `MY_WHATSAPP_NUMBER`
- `NOTIFICATION_TIMEZONE=Asia/Kolkata` (or your desired timezone)
- `DEPLOY_TARGET=server-cron` or `VITE_DEPLOY_TARGET=server-cron`
- `ENABLE_INTERNAL_CRON=true` (optional alias)

This enables the internal cron scheduler in `backend/server.js`, which runs daily at `22:00` in the configured timezone.

The backend also logs startup details, including deploy target, cron status, and timezone.
