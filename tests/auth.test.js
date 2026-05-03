import { describe, it, expect, afterAll } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/server.js';

afterAll(async () => {
  await mongoose.disconnect();
});

describe('GET /', () => {
  it('returns API running message', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Tuk-Tuk API is running!');
  });
});

describe('POST /api/auth/register', () => {
  it('returns 422 when fields are missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({});
    expect(res.status).toBe(422);
    expect(res.body.errors).toBeDefined();
  });

  it('returns 422 when email is invalid', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'notanemail', password: 'secret123' });
    expect(res.status).toBe(422);
  });

  it('returns 422 when password is too short', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'test@police.lk', password: '123' });
    expect(res.status).toBe(422);
  });
});

describe('POST /api/auth/login', () => {
  it('returns 422 when fields are missing', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({});
    expect(res.status).toBe(422);
  });

  it('returns 200 and a token with valid admin credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@police.lk', password: 'Lanka#2024' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('returns 400 with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@police.lk', password: 'wrongpassword' });
    expect(res.status).toBe(400);
  });
});

describe('Protected routes', () => {
  it('returns 401 when no token is provided', async () => {
    const res = await request(app).get('/api/vehicles');
    expect(res.status).toBe(401);
  });

  it('returns 200 with a valid token', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@police.lk', password: 'Lanka#2024' });
    const token = loginRes.body.token;

    const res = await request(app)
      .get('/api/vehicles')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
  });
});

describe('GET /api/drivers', () => {
  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/drivers');
    expect(res.status).toBe(401);
  });

  it('returns paginated drivers with valid token', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@police.lk', password: 'Lanka#2024' });
    const token = loginRes.body.token;

    const res = await request(app)
      .get('/api/drivers')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.total).toBeDefined();
  });
});

describe('GET /api/stations', () => {
  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/stations');
    expect(res.status).toBe(401);
  });

  it('returns paginated stations with valid token', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@police.lk', password: 'Lanka#2024' });
    const token = loginRes.body.token;

    const res = await request(app)
      .get('/api/stations')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.total).toBeDefined();
  });
});

describe('POST /api/auth/register', () => {
  it('does not allow registering as admin', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: `test${Date.now()}@police.lk`, password: 'secret123', role: 'admin' });
    expect(res.status).toBe(201);
    expect(res.body.user.role).not.toBe('admin');
  });
});
