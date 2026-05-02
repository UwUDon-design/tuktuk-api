# AI Usage Disclosure

**Course:** NB6007CEM — Web API Development
**Tool Used:** Claude Code by Anthropic (claude.ai/code)
**Model:** Claude Sonnet 4.6

---

## What AI Was Used For

This project used Claude Code as an AI code generation assistant throughout development. The following areas involved AI-assisted code generation:

### Code Generation
- **Express route and controller scaffolding** — generating the boilerplate structure for each resource (auth, drivers, vehicles, locations, provinces, districts, police stations)
- **Mongoose model definitions** — schema fields, data types, references, and indexes
- **JWT authentication middleware** — the `protect`, `adminOnly`, and `policeOrAdmin` middleware in `src/middleware/auth.js`
- **Input validation rules** — all rule sets in `src/middleware/validators.js` using `express-validator`
- **Seed script** — `src/seed.js` for generating realistic Sri Lankan test data including 200 drivers, 200 vehicles, and ~134,000 location records
- **OpenAPI/Swagger spec** — the full `src/swagger.js` specification covering all 27 endpoints
- **Pagination logic** — the `page/limit/sort` query param pattern used across drivers, vehicles, locations, and stations
- **Centralized error handler** — `src/middleware/errorHandler.js`
- **Rate limiting setup** — `express-rate-limit` configuration in `src/server.js`
- **Jest test suite** — `tests/auth.test.js` covering authentication and protected routes

### Debugging and Problem Solving
- Resolving Vercel serverless deployment issues (top-level `await`, `export default app`)
- Fixing Swagger UI not rendering on Vercel (switched from `swagger-ui-express` to CDN-based approach)
- Resolving ESLint errors across the codebase
- Fixing Jest ESM compatibility (`--experimental-vm-modules`, `transform: {}`)

### Architecture Decisions
- Choosing the middleware chain order (`protect → role guard → validators → validate → controller`)
- Structuring the MongoDB Atlas connection for serverless compatibility
- Deciding on the branching strategy (`main → develop → feature/*`)

---

## What Was Done Manually

- Setting up the MongoDB Atlas cluster and configuring network access
- Configuring environment variables in the Vercel dashboard
- Deploying to Vercel via CLI
- Running and verifying the seed script against the live database
- Testing API endpoints manually via Swagger UI and browser

---

## How It Was Used

Claude Code was used as an interactive assistant through the development process — prompting it to generate specific functions, reviewing the output, identifying issues, and iterating. All generated code was reviewed for correctness before being committed. The overall project structure, requirements, and design decisions were directed by the developer.

---

## Tool Information

| Field | Detail |
|---|---|
| Tool | Claude Code |
| Provider | Anthropic |
| Website | https://claude.ai/code |
| Model | Claude Sonnet 4.6 |
| Usage type | Code generation and debugging assistance |
