# Project Context — Tuk-Tuk Tracking API

## Who I Am
I'm a student at NIBM completing coursework NB6007CEM (Web API Development) for BSc (Hons) Computing (Coventry University). This is a graded assignment, not a real production system.

## What This Project Is
A RESTful API for a Real-Time Tuk-Tuk Tracking & Movement Logging System for Sri Lanka Police. No frontend. Built with Node.js + Express (ES Modules), MongoDB + Mongoose, JWT auth. Deployed on Vercel (serverless) with MongoDB Atlas.

**Live URL:** https://tuktuk-api.vercel.app  
**Swagger Docs:** https://tuktuk-api.vercel.app/api-docs  
**GitHub:** main branch, user is UwUDon-design

## Tech Stack
- Node.js with `"type": "module"` (ES Modules throughout — all imports use ESM syntax)
- Express 5
- MongoDB Atlas (free M0, Singapore) via Mongoose 9
- JWT (`jsonwebtoken` + `bcryptjs`)
- `express-validator` for input validation
- `express-rate-limit` for rate limiting
- Jest + Supertest for tests (`--experimental-vm-modules` flag required for ESM)
- ESLint 9 flat config (`eslint.config.js`)
- Vercel for hosting (`vercel.json` routes all traffic to `src/server.js`)

## Project Structure
```
src/
├── server.js                  # Entry point. Top-level await for mongoose.connect(). app.listen() only when NODE_ENV !== 'production'. Exports default app for Vercel.
├── seed.js                    # Clears and repopulates DB. Run with: node src/seed.js
├── swagger.js                 # Full OpenAPI 3.0 spec as inline JS object (no swagger-jsdoc)
├── models/
│   ├── User.js                # name, email, password, role (admin/police/operator), district, province
│   ├── Province.js            # name, code
│   ├── District.js            # name, code, province (ref)
│   ├── Driver.js              # name, licenseNumber (unique), phone, nationalId (unique), district (ref)
│   ├── Vehicle.js             # registrationNumber, driver (ref), district (ref), province (ref), color, year, deviceId
│   ├── Location.js            # vehicle (ref), latitude, longitude, speed, timestamp
│   └── PoliceStation.js       # name, code, address, contactNumber, district (ref), province (ref), isActive
├── controllers/               # One file per resource. All async/await with try/catch.
├── routes/                    # One file per resource. Middleware chain: protect → role guard → validators → validate → controller
└── middleware/
    ├── auth.js                # protect (JWT verify), adminOnly, policeOrAdmin
    ├── validate.js            # Reads validationResult(), returns 422 with errors array
    ├── validators.js          # All rule sets: registerRules, loginRules, createDriverRules, createVehicleRules, addLocationRules, createProvinceRules, createDistrictRules, createStationRules, mongoIdParam(paramName)
    └── errorHandler.js        # 4-arg Express error middleware (err, req, res, _next). Registered last in server.js.

tests/
└── auth.test.js               # 9 Jest tests. All passing.

vercel.json                    # Routes /(.*) → src/server.js via @vercel/node
jest.config.js                 # testEnvironment: node, transform: {}
eslint.config.js               # Flat config, node globals, no-unused-vars warn with ^_ ignore patterns
.env.example                   # MONGO_URI, JWT_SECRET, PORT
AI_USAGE.md                    # AI code generation disclosure document (required by lecturer)
```

## API Endpoints Summary
| Method | Path | Auth |
|--------|------|------|
| POST | /api/auth/register | None |
| POST | /api/auth/login | None |
| GET | /api/health | None |
| GET/POST | /api/provinces | Any / Admin |
| GET | /api/provinces/:id | Any |
| GET | /api/provinces/:id/districts | Any |
| GET/POST | /api/districts | Any / Admin |
| GET | /api/districts/:id | Any |
| GET/POST | /api/drivers | Police+Admin / Admin |
| GET/PUT/DELETE | /api/drivers/:id | Police+Admin / Admin |
| GET/POST | /api/vehicles | Police+Admin / Admin |
| GET/PUT/DELETE | /api/vehicles/:id | Police+Admin / Admin |
| POST | /api/locations | Any |
| GET | /api/locations/active | Police+Admin |
| GET | /api/locations/:vehicleId/last | Police+Admin |
| GET | /api/locations/:vehicleId/history | Police+Admin |
| GET/POST | /api/stations | Police+Admin / Admin |
| GET/PUT/DELETE | /api/stations/:id | Police+Admin / Admin |

**Total: 28 endpoints across 8 groups**

## Pagination
`getAllVehicles`, `getAllDrivers`, `getLocationHistory`, `getAllStations` all support:
Query params: `page` (default 1), `limit` (default 20/50), `sort` (default `-createdAt`)
Response shape: `{ data: [...], total, page, limit, pages }`
Uses `Promise.all([find(...).skip().limit(), countDocuments()])`.

## Filtering / Search
- Vehicles: filter by `province`, `district`, `color`
- Drivers: filter by `district`, search by `name` (case-insensitive partial match via `$regex`)
- Stations: filter by `district`, `province`

## Rate Limiting
- `/api/*` — 100 req / 15 min
- `/api/auth` — 10 req / 15 min

## Seed Data
- 9 provinces, 25 districts (all real Sri Lankan ones)
- 1 admin (`admin@police.lk` / `Lanka#2024`), 20 police officers (`officer1@police.lk` ... `officer20@police.lk` / `Lanka#2024`)
- All users have realistic Sri Lankan names (e.g. Dimuth Karunaratne, Kasun Rajapaksa)
- 28 police stations covering all 25 districts
- 200 drivers with realistic names, NIC format `YYDDDSSSSV` (e.g. `70001000V`), license format `B` + 7 digits
- 200 vehicles with Sri Lankan-style plates (e.g. `WP-A-1001`), device IDs `GPS100001+`
- ~134,600 location records (15-min pings, 7 days, all vehicles)

## Git Branching Strategy
Professional branching workflow used:
- `main` — stable production branch
- `develop` — integration branch (merges into main)
- `feature/health-endpoint` — added `GET /api/health` endpoint
- `feature/driver-search` — added `?name=` search filter on drivers list
All feature branches were merged into develop with `--no-ff`, then develop merged into main.

## Vercel-Specific Notes
- Top-level `await mongoose.connect()` works because of ES Modules
- `app.listen()` is skipped in production (`NODE_ENV !== 'production'`)
- `export default app` is required by Vercel
- Swagger UI is served via CDN (unpkg) — `swagger-ui-express` was removed because it doesn't serve static assets correctly in Vercel serverless. `/api-docs` returns HTML that loads from CDN. `/api-docs.json` returns the raw spec.
- Deployment Protection was disabled in Vercel dashboard so the API is publicly accessible
- MONGO_URI and JWT_SECRET are set as environment variables in the Vercel dashboard

## Known Quirks
- `authController.js` returns `400` (not `401`) for wrong password — the test reflects this
- `errorHandler.js` uses `_next` (prefixed underscore) because Express requires 4 args for error middleware but `next` is never called
- `swagger-jsdoc` and `swagger-ui-express` are NOT in dependencies — removed. The spec is written manually in `swagger.js`
- Jest uses `--forceExit` because the MongoDB connection keeps the process alive after tests finish
- `licenseNumber` and `nationalId` on Driver model both have unique indexes — seed uses deterministic formulas to avoid collisions

## Commands
```bash
npm run dev      # nodemon local dev
npm run lint     # ESLint src/
npm test         # Jest (9 tests, all pass) — requires DB to be seeded with Lanka#2024
node src/seed.js # Reseed database (takes ~3-5 min due to 134k location records)
npx vercel --prod # Deploy to production
```

## What's Done (Coursework Checklist)
- [x] REST API with proper HTTP methods and status codes
- [x] JWT authentication with role-based access control
- [x] Input validation (express-validator, 422 responses)
- [x] MongoDB with Mongoose (7 models)
- [x] Seed data (200 vehicles, 25 districts, 28 stations, 134k+ location records)
- [x] Police station CRUD with district/province linking
- [x] Deployed and publicly accessible (Vercel)
- [x] Swagger/OpenAPI documentation (/api-docs)
- [x] Pagination, filtering, sorting on list endpoints
- [x] Rate limiting
- [x] Centralized error handling
- [x] ESLint
- [x] Automated tests (Jest + Supertest, 9 tests)
- [x] Git branching strategy (main / develop / feature branches)
- [x] AI usage disclosure (AI_USAGE.md)
