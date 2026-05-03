# Tuk-Tuk Tracking API

A RESTful API for tracking registered tuk-tuks in real time, built for Sri Lanka Police. Developed as part of coursework NB6007CEM — Web API Development at NIBM / Coventry University.

## Overview

The API handles vehicle registration, driver records, GPS location logging, police station management, and user authentication with role-based access control. It has no frontend — it's designed to be consumed by a mobile app or dashboard.

**Live API:** https://tuktuk-api.vercel.app  
**API Docs:** https://tuktuk-api.vercel.app/api-docs

## Tech Stack

- Node.js + Express 5 (ES Modules)
- MongoDB Atlas + Mongoose
- JWT authentication
- Deployed on Vercel

## Getting Started

```bash
npm install
cp .env.example .env   # fill in your MONGO_URI and JWT_SECRET
npm run dev
```

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@police.lk | Lanka#2024 |
| Officer | officer1@police.lk | Lanka#2024 |

## Commands

```bash
npm run dev       # start local dev server
npm test          # run test suite
npm run lint      # run ESLint
node src/seed.js  # reseed the database
```

## Notes

- Swagger docs are available at `/api-docs`
- All protected routes require `Authorization: Bearer <token>` header
- See `AI_USAGE.md` for AI usage disclosure
