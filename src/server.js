import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import swaggerDocument from './swagger.js';
import errorHandler from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import provinceRoutes from './routes/provinceRoutes.js';
import districtRoutes from './routes/districtRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import driverRoutes from './routes/driverRoutes.js';
import policeStationRoutes from './routes/policeStationRoutes.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tuktukdb';
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests, please try again after 15 minutes' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many login attempts, please try again after 15 minutes' }
});

app.use('/api/', limiter);
app.use('/api/auth', authLimiter);

app.get('/api-docs.json', (req, res) => res.json(swaggerDocument));

app.get('/api-docs', (req, res) => {
  res.send(`<!DOCTYPE html>
<html>
  <head>
    <title>Tuk-Tuk API Docs</title>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css">
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
    <script>
      SwaggerUIBundle({
        url: '/api-docs.json',
        dom_id: '#swagger-ui',
        presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset],
        layout: 'BaseLayout'
      });
    </script>
  </body>
</html>`);
});

app.use('/api/auth', authRoutes);
app.use('/api/provinces', provinceRoutes);
app.use('/api/districts', districtRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/stations', policeStationRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Tuk-Tuk API is running!' });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

app.use(errorHandler);

// Top-level await ensures MongoDB is connected before any request is handled.
// Works because this project uses ES modules ("type": "module").
await mongoose.connect(MONGO_URI);
console.log('Connected to MongoDB');

// Vercel handles the HTTP server in production; listen only in local dev.
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
