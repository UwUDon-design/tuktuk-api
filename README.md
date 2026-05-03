# Tuk-Tuk Tracking API

REST API for real-time tuk-tuk tracking built for Sri Lanka Police. Part of coursework NB6007CEM (Web API Development) at NIBM / Coventry University.

**Student ID:** YOUR_STUDENT_ID

**Live:** https://tuktuk-api.vercel.app  
**Docs:** https://tuktuk-api.vercel.app/api-docs

## Stack

Node.js + Express · MongoDB Atlas + Mongoose · JWT · Vercel

## Running locally

```bash
npm install
cp .env.example .env
# add your MONGO_URI and JWT_SECRET to .env
npm run dev
```

## Test credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@police.lk | Lanka#2024 |
| Officer | officer1@police.lk | Lanka#2024 |

## Scripts

```bash
npm run dev       # local dev server
npm test          # jest tests
npm run lint      # eslint
node src/seed.js  # reseed the database
```

Swagger docs at `/api-docs`. Protected routes need `Authorization: Bearer <token>`.  
See `AI_USAGE.md` for AI usage disclosure.
