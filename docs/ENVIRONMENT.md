# GoShashi — Environment Variables Reference

| Variable | Description | Required in Production | Default / Example |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | Runtime environment (`development`, `production`, `test`) | Yes | `development` |
| `PORT` | API Server port | Yes | `4000` |
| `WEB_PORT` | Web frontend port | Yes | `3000` |
| `DATABASE_URL` | MySQL connection string for Prisma | Yes | `mysql://root:@localhost:3306/goshashi` |
| `API_URL` | Base public URL of API | Yes | `https://api.goshashi.com` |
| `WEB_URL` | Base public URL of Web frontend | Yes | `https://web.goshashi.com` |
| `JWT_SECRET` | Secret key for signing access tokens (>= 32 chars) | Yes | Secure random string |
| `JWT_REFRESH_SECRET` | Secret key for signing refresh tokens (>= 32 chars) | Yes | Secure random string |
| `RAZORPAY_KEY_ID` | Razorpay public Key ID | Yes | `rzp_live_...` |
| `RAZORPAY_KEY_SECRET` | Razorpay private Key Secret | Yes | Razorpay API Secret |
| `RAZORPAY_WEBHOOK_SECRET` | Secret configured in Razorpay Webhook dashboard | Yes | Webhook secret |
| `GOOGLE_MAPS_API_KEY` | Google Maps API key for geocoding & autocomplete | Optional | API Key |
| `SMTP_HOST` | Hostinger SMTP host | Optional | `smtp.hostinger.com` |
| `SMTP_PORT` | SMTP port | Optional | `465` |
| `SMTP_USER` | SMTP username | Optional | `notifications@goshashi.com` |
| `SMTP_PASSWORD` | SMTP password | Optional | SMTP password |
| `STORAGE_ENDPOINT` | Document storage adapter (`local` or `s3`) | Yes | `local` |
