# AI Prompts Log

This document records the prompts and requests made to Claude Code (Anthropic) during the development of this project. Prompts are grouped by feature area.

---

## Initial Setup

> "set up a basic express server with es modules and connect it to mongodb"

> "create mongoose models for User, Province, District, Driver, Vehicle and Location for a tuk-tuk tracking system for sri lanka police"

---

## Authentication

> "add JWT authentication — register and login endpoints, protect middleware that reads the bearer token, and role guards for admin and police roles"

---

## Routes and Controllers

> "add CRUD routes and controllers for drivers and vehicles with role-based access — police can read, only admin can create update delete"

> "add routes and controllers for provinces and districts, provinces and districts should be readable by anyone but only admin can create them"

> "add a location controller — any device can post a GPS ping, but only police and admin can read location history and active vehicles"

> "create a PoliceStation model with name, code, address, contactNumber, district and province fields and add full CRUD for it"

---

## Validation

> "add input validation to all POST routes using express-validator — validate email format, password length, phone number format, latitude and longitude ranges, and mongodb objectids in route params"

---

## Deployment

> "how do i deploy this to vercel, it needs to work with mongodb atlas"

> "the swagger UI is completely blank on vercel, it works locally but not in production — fix it"

> "the api is returning 500 errors after deployment, the issue is mongodb isnt connecting"

---

## Documentation

> "write a full openapi 3.0 swagger spec for all the endpoints in this project as a plain javascript object, no swagger-jsdoc"

---

## Pagination and Filtering

> "add pagination to the vehicles, drivers, location history and police stations list endpoints — support page, limit and sort query params and return total, pages in the response"

> "add filtering to vehicles by province, district and color"

---

## Rate Limiting

> "add rate limiting — 100 requests per 15 minutes for general api routes and 10 per 15 minutes for auth routes"

---

## Error Handling

> "add a centralised express error handler middleware and register it last in server.js"

---

## Seed Data

> "write a seed script that creates 9 provinces, 25 districts, 1 admin, 20 police officers, 200 drivers, 200 vehicles and 7 days of 15-minute gps location pings for every vehicle"

> "update the seed data to use realistic sri lankan names instead of Driver 1, Officer 1 etc, and use proper sri lankan nic format and license number format"

---

## Testing

> "write jest tests using supertest for the auth endpoints — cover register validation, login success and failure, and protected route access"

---

## Git Branching

> "set up a professional branching structure with a develop branch and feature branches"

---

## Debugging

> "eslint is showing 26 errors, help me fix them"

> "the jest test for wrong password is failing, it expects 401 but gets 400"

> "jest keeps hanging after tests finish, it wont exit"
