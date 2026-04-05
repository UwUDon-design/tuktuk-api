import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Province from './models/Province.js';
import District from './models/District.js';
import Driver from './models/Driver.js';
import Vehicle from './models/Vehicle.js';
import Location from './models/Location.js';
import User from './models/User.js';

const MONGO_URI = 'mongodb://localhost:27017/tuktukdb';

const provinces = [
  { name: 'Western', code: 'WP' },
  { name: 'Central', code: 'CP' },
  { name: 'Southern', code: 'SP' },
  { name: 'Northern', code: 'NP' },
  { name: 'Eastern', code: 'EP' },
  { name: 'North Western', code: 'NWP' },
  { name: 'North Central', code: 'NCP' },
  { name: 'Uva', code: 'UP' },
  { name: 'Sabaragamuwa', code: 'SGP' }
];

const districtsByProvince = {
  WP: ['Colombo', 'Gampaha', 'Kalutara'],
  CP: ['Kandy', 'Matale', 'Nuwara Eliya'],
  SP: ['Galle', 'Matara', 'Hambantota'],
  NP: ['Jaffna', 'Kilinochchi', 'Mannar'],
  EP: ['Batticaloa', 'Ampara', 'Trincomalee'],
  NWP: ['Kurunegala', 'Puttalam'],
  NCP: ['Anuradhapura', 'Polonnaruwa'],
  UP: ['Badulla', 'Monaragala'],
  SGP: ['Ratnapura', 'Kegalle']
};

const colors = ['Yellow', 'Blue', 'Red', 'Green', 'White', 'Black'];

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getRandomFloat = (min, max) => parseFloat((Math.random() * (max - min) + min).toFixed(6));

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const seed = async () => {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await Province.deleteMany();
  await District.deleteMany();
  await Driver.deleteMany();
  await Vehicle.deleteMany();
  await Location.deleteMany();
  await User.deleteMany();
  console.log('Cleared existing data');

  // Seed provinces
  const createdProvinces = await Province.insertMany(provinces);
  console.log('Provinces seeded');

  // Seed districts
  const districtDocs = [];
  for (const province of createdProvinces) {
    const names = districtsByProvince[province.code];
    for (const name of names) {
      districtDocs.push({
        name,
        code: name.toUpperCase().replace(' ', '_'),
        province: province._id
      });
    }
  }
  const createdDistricts = await District.insertMany(districtDocs);
  console.log('Districts seeded');

  // Seed admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await User.create({
    name: 'Admin User',
    email: 'admin@police.lk',
    password: hashedPassword,
    role: 'admin'
  });
  console.log('Admin user seeded');

  // Seed police users
  for (let i = 1; i <= 20; i++) {
    const district = getRandomItem(createdDistricts);
    await User.create({
      name: `Officer ${i}`,
      email: `officer${i}@police.lk`,
      password: hashedPassword,
      role: 'police',
      district: district.name,
      province: district.province
    });
  }
  console.log('Police users seeded');

  // Seed drivers
  const driverDocs = [];
  for (let i = 1; i <= 200; i++) {
    const district = getRandomItem(createdDistricts);
    driverDocs.push({
      name: `Driver ${i}`,
      licenseNumber: `LIC${String(i).padStart(6, '0')}`,
      phone: `07${getRandomInt(10000000, 99999999)}`,
      nationalId: `NID${String(i).padStart(9, '0')}`,
      district: district._id
    });
  }
  const createdDrivers = await Driver.insertMany(driverDocs);
  console.log('Drivers seeded');

  // Seed vehicles
  const vehicleDocs = [];
  for (let i = 1; i <= 200; i++) {
    const driver = createdDrivers[i - 1];
    const district = getRandomItem(createdDistricts);
    const province = createdProvinces.find(p => p._id.equals(district.province));
    vehicleDocs.push({
      registrationNumber: `TK${String(i).padStart(4, '0')}`,
      driver: driver._id,
      district: district._id,
      province: province._id,
      color: getRandomItem(colors),
      year: getRandomInt(2010, 2023),
      deviceId: `DEV${String(i).padStart(6, '0')}`
    });
  }
  const createdVehicles = await Vehicle.insertMany(vehicleDocs);
  console.log('Vehicles seeded');

  // Seed location history - 1 week of data
  console.log('Seeding location history, this may take a moment...');
  const now = new Date();
  const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const pingInterval = 15 * 60 * 1000; // every 15 minutes

  const locationDocs = [];
  for (const vehicle of createdVehicles) {
    let currentTime = new Date(oneWeekAgo);
    while (currentTime <= now) {
      locationDocs.push({
        vehicle: vehicle._id,
        latitude: getRandomFloat(5.9, 9.8),   // Sri Lanka latitude range
        longitude: getRandomFloat(79.6, 81.9), // Sri Lanka longitude range
        speed: getRandomInt(0, 60),
        timestamp: new Date(currentTime)
      });
      currentTime = new Date(currentTime.getTime() + pingInterval);
    }
  }

  // Insert in batches to avoid memory issues
  const batchSize = 1000;
  for (let i = 0; i < locationDocs.length; i += batchSize) {
    await Location.insertMany(locationDocs.slice(i, i + batchSize));
    console.log(`Inserted ${Math.min(i + batchSize, locationDocs.length)} / ${locationDocs.length} locations`);
  }

  console.log('All data seeded successfully!');
  mongoose.disconnect();
};

seed().catch((err) => {
  console.error('Seeding error:', err);
  mongoose.disconnect();
});