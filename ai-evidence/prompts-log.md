# AI Prompts Log

Prompts and requests made to Claude Code during development, roughly in order.

---

## Initial Setup

> "can u set up a basic express server with es modules and connect it to mongodb"

> "create the mongoose models for this — User, Province, District, Driver, Vehicle and Location, its for a tuktuk tracking system for sri lanka police"

---

## Authentication

> "add jwt auth — register and login, and a middleware that checks the token, also need role based access for admin and police"

---

## Routes and Controllers

> "add crud routes and controllers for drivers and vehicles, police can only read, admin can do everything"

> "do the same for provinces and districts, anyone can read but only admin creates them"

> "add the location stuff — any device can post a gps ping but only police and admin can see the history and active vehicles"

> "add a police station model and full crud for it, needs name code address contactnumber district and province"

---

## Validation

> "add input validation to all the post routes using express-validator, check email format, password length, phone number, lat long ranges and mongodb ids in params"

---

## Deployment

> "how do i deploy this to vercel, it needs to work with mongodb atlas"

> "the swagger ui is completely blank on vercel, it works fine locally whats wrong"

> "the api is giving 500 errors after deployment, mongodb isnt connecting"

---

## Documentation

> "write the full swagger spec for all the endpoints as a plain js object, dont use swagger-jsdoc"

---

## Pagination and Filtering

> "add pagination to vehicles, drivers, location history and stations — page limit and sort params, return total and pages in the response"

> "add filtering to vehicles by province district and color"

---

## Rate Limiting

> "add rate limiting, 100 requests per 15 min for the api and 10 per 15 min for auth"

---

## Error Handling

> "add a centralised error handler middleware and put it last in server.js"

---

## Seed Data

> "write a seed script, need 9 provinces 25 districts 1 admin 20 police officers 200 drivers 200 vehicles and 7 days of 15 min gps pings for every vehicle"

> "the seed data looks too fake, update the names to real sri lankan names and fix the nic and license number format"

---

## Testing

> "write jest tests with supertest for the auth endpoints — validation, login working, login failing, and protected route with and without token"

---

## Git Branching

> "how do we set up branching properly like a professional project"

---

## CI/CD

> "how do cicd pipelines work and can we add that"

> "add github actions to run lint and tests on every push and auto deploy to vercel on main"

---

## Debugging

> "eslint is showing 26 errors help"

> "the jest test for wrong password is failing it expects 401 but gets 400"

> "jest keeps hanging after the tests finish and wont exit"

> "the swagger ui is just blank on vercel why"
