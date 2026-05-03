# AI Prompts Log

Prompts made to Claude Code during development, roughly in order.

---

## Initial Setup

> "can u set up a basic express server with es modules nd connect it to mongodb"

> "create the mongoose models for this tuk tuk tracking thing for sri lanka police, need User Province District Driver Vehicle and Location"

---

## Authentication

> "add jwt auth, register and login endpoints nd a middleware that checks the token, also need role based stuff for admin and police"

---

## Routes and Controllers

> "add crud routes and controllers for drivers and vehicles, police can only read, admin can do everything like create update delete nd stuff"

> "do the same for provinces and districts, anyone can read but only admin can create them"

> "add the location stuff, any device can post a gps ping but only police nd admin can see the history and active vehicles and all"

> "add a police station model with name code address contactnumber district nd province and do full crud for it"

---

## Validation

> "add validation to all the post routes using express-validator, check email, password length, phone number, lat long ranges nd mongodb ids in the params nd all"

---

## Deployment

> "how do i deploy this to vercel, needs to work with mongodb atlas"

> "the swagger ui is just blank on vercel, works fine locally tho whats the issue"

> "the api is giving 500 errors after deployment, mongodb isnt connecting"

---

## Documentation

> "write the full swagger spec for all the endpoints as a plain js object, dont use swagger-jsdoc or anything like that"

---

## Pagination and Filtering

> "add pagination to vehicles, drivers, location history and stations — page limit sort params nd return total and pages in the response"

> "add filtering to vehicles by province district and color"

---

## Rate Limiting

> "add rate limiting, 100 requests per 15 min for the api nd like 10 per 15 min for auth so ppl cant brute force it"

---

## Error Handling

> "add a centralised error handler and put it last in server.js"

---

## Seed Data

> "write a seed script, need 9 provinces 25 districts 1 admin 20 police officers 200 drivers 200 vehicles nd like 7 days of 15 min gps pings for every vehicle"

> "the seed data is way too obvious like Driver 1 Driver 2 and stuff, update the names to actual sri lankan names nd fix the nic and license number format too"

---

## Testing

> "write jest tests with supertest for the auth stuff — validation errors, login working nd failing, nd protected route with and without a token"

---

## Git Branching

> "how do we set up branching properly, lecturer wants it to look professional u know"

---

## CI/CD

> "how do cicd pipelines work and can we add that into this"

> "add github actions to run the lint and tests on every push nd auto deploy to vercel when we push to main"

---

## Debugging

> "eslint is showing like 26 errors help"

> "the jest test for wrong password is failing, it expects 401 but gets 400 whats wrong"

> "jest keeps hanging after tests finish and wont exit"

> "the swagger ui is blank on vercel why is that"
