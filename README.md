# MyApp — Next.js Dashboard

A full login + dashboard app built with Next.js 14 App Router.

## Project Structure

```
myapp/
├── app/
│   ├── layout.js          ← Root layout (wraps ALL pages)
│   ├── globals.css        ← Global styles & CSS variables
│   ├── page.js            ← "/" → redirects to /login
│   ├── login/
│   │   ├── page.js        ← Login form (Client Component)
│   │   └── login.module.css
│   └── dashboard/
│       ├── page.js        ← Dashboard (Client Component)
│       └── dashboard.module.css
├── components/
│   ├── Sidebar.js         ← Sidebar nav (reusable)
│   ├── Sidebar.module.css
│   ├── StatCard.js        ← Stat card (reusable)
│   └── StatCard.module.css
├── next.config.js
└── package.json
```

## How to Run

1. Install Node.js from https://nodejs.org (v18 or higher)

2. Open a terminal in this folder and run:

```bash
npm install
npm run dev
```

3. Open your browser at: http://localhost:3000

4. Login with:
   - Email: demo@myapp.com
   - Password: password

## Key Concepts Used

- **App Router** — each folder in `app/` is a page route
- **Client Components** — `'use client'` at top = uses React hooks (useState, useEffect)
- **CSS Modules** — `*.module.css` files scope styles to one component only
- **sessionStorage** — saves the logged-in user between page navigations
- **useRouter** — Next.js hook for redirecting between pages

## Next Steps

- Replace `VALID_USERS` in `login/page.js` with a real API call
- Add a database (e.g. Prisma + PostgreSQL)
- Add authentication (e.g. NextAuth.js)
- Deploy to Vercel (free): https://vercel.com
