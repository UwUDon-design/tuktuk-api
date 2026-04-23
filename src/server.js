import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
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

// Top-level await ensures MongoDB is connected before any request is handled.
// Works because this project uses ES modules ("type": "module").
await mongoose.connect(MONGO_URI);
console.log('Connected to MongoDB');

// Vercel handles the HTTP server in production; listen only in local dev.
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
