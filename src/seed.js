import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Province from './models/Province.js';
import District from './models/District.js';
import Driver from './models/Driver.js';
import Vehicle from './models/Vehicle.js';
import Location from './models/Location.js';
import User from './models/User.js';
import PoliceStation from './models/PoliceStation.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tuktukdb';

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
  NP: ['Jaffna', 'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu'],
  EP: ['Batticaloa', 'Ampara', 'Trincomalee'],
  NWP: ['Kurunegala', 'Puttalam'],
  NCP: ['Anuradhapura', 'Polonnaruwa'],
  UP: ['Badulla', 'Monaragala'],
  SGP: ['Ratnapura', 'Kegalle']
};

const firstNames = [
  'Kasun', 'Nuwan', 'Ruwan', 'Thilan', 'Chaminda', 'Saman', 'Pradeep', 'Lasith',
  'Mahesh', 'Roshan', 'Dilshan', 'Asanka', 'Nimal', 'Suresh', 'Amal', 'Tharaka',
  'Charith', 'Prabath', 'Gayan', 'Sanjeewa', 'Ranga', 'Harsha', 'Chatura', 'Damith',
  'Prasad', 'Dimuth', 'Kavinda', 'Ishan', 'Sachith', 'Dinesh', 'Chathura', 'Lasantha',
  'Bandula', 'Udara', 'Janaka', 'Thisara', 'Amila', 'Vimukthi', 'Nalin', 'Sandun'
];

const lastNames = [
  'Perera', 'Silva', 'Fernando', 'De Silva', 'Jayawardena', 'Gunawardena',
  'Wickramasinghe', 'Senanayake', 'Dissanayake', 'Bandara', 'Rajapaksa',
  'Jayasuriya', 'Karunaratne', 'Amarasinghe', 'Pathirana', 'Ranasinghe',
  'Samaraweera', 'Hettige', 'Weerasinghe', 'Mendis', 'Liyanage', 'Gamage',
  'Kumarasinghe', 'Siriwardena', 'Gunathilake', 'Rathnayake', 'Jayarathna',
  'Abeywickrama', 'Wijesinghe', 'Thilakasiri', 'Weeraratne', 'Balasuriya',
  'Munasinghe', 'Abeyrathne', 'Kodikara', 'Ratnayake', 'Alwis', 'Dharmarathne'
];

const colors = ['Yellow', 'Blue', 'Red', 'Green', 'White', 'Black'];

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomFloat = (min, max) => parseFloat((Math.random() * (max - min) + min).toFixed(6));
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomName = () => `${getRandomItem(firstNames)} ${getRandomItem(lastNames)}`;

// Sri Lankan NIC: YYDDDSSSSV (2+3+4 digits + V = 10 chars)
const generateNIC = (i) => {
  const yr = String(70 + Math.floor(i / 266)).padStart(2, '0');
  const day = String(1 + (i % 266)).padStart(3, '0');
  const seq = String(i).padStart(4, '0');
  return `${yr}${day}${seq}V`;
};

const seed = async () => {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  await Province.deleteMany();
  await District.deleteMany();
  await Driver.deleteMany();
  await Vehicle.deleteMany();
  await Location.deleteMany();
  await User.deleteMany();
  await PoliceStation.deleteMany();
  console.log('Cleared existing data');

  const createdProvinces = await Province.insertMany(provinces);
  console.log('Provinces seeded');

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

  const hashedPassword = await bcrypt.hash('Lanka#2024', 10);
  await User.create({
    name: 'Roshan Perera',
    email: 'admin@police.lk',
    password: hashedPassword,
    role: 'admin'
  });
  console.log('Admin user seeded');

  const officerNames = [
    'Dimuth Karunaratne', 'Kasun Rajapaksa', 'Nuwan Jayawardena', 'Thilan Samaraweera',
    'Chaminda Weerasinghe', 'Saman Pathirana', 'Pradeep Dissanayake', 'Lasith Perera',
    'Mahesh Gunathilake', 'Roshan Bandara', 'Dilshan Fernando', 'Asanka De Silva',
    'Nimal Liyanage', 'Suresh Gamage', 'Amal Ranasinghe', 'Tharaka Senanayake',
    'Charith Gunawardena', 'Prabath Wickramasinghe', 'Gayan Mendis', 'Sanjeewa Silva'
  ];

  for (let i = 0; i < 20; i++) {
    const district = getRandomItem(createdDistricts);
    await User.create({
      name: officerNames[i],
      email: `officer${i + 1}@police.lk`,
      password: hashedPassword,
      role: 'police',
      district: district.name,
      province: district.province
    });
  }
  console.log('Police users seeded');

  const stationData = [
    { name: 'Colombo Fort Police Station',     code: 'PS_COL_001', address: 'Fort, Colombo 01',          contactNumber: '0112321111', districtName: 'Colombo' },
    { name: 'Nugegoda Police Station',         code: 'PS_COL_002', address: 'Nugegoda, Colombo',          contactNumber: '0112852222', districtName: 'Colombo' },
    { name: 'Gampaha Police Station',          code: 'PS_GAM_001', address: 'Gampaha Town',               contactNumber: '0332222333', districtName: 'Gampaha' },
    { name: 'Negombo Police Station',          code: 'PS_GAM_002', address: 'Negombo, Gampaha',           contactNumber: '0312223344', districtName: 'Gampaha' },
    { name: 'Kalutara Police Station',         code: 'PS_KAL_001', address: 'Kalutara Town',              contactNumber: '0342222445', districtName: 'Kalutara' },
    { name: 'Kandy Central Police Station',    code: 'PS_KAN_001', address: 'Kandy City Centre',          contactNumber: '0812224556', districtName: 'Kandy' },
    { name: 'Peradeniya Police Station',       code: 'PS_KAN_002', address: 'Peradeniya, Kandy',          contactNumber: '0812225667', districtName: 'Kandy' },
    { name: 'Matale Police Station',           code: 'PS_MAT_001', address: 'Matale Town',                contactNumber: '0662226778', districtName: 'Matale' },
    { name: 'Nuwara Eliya Police Station',     code: 'PS_NUW_001', address: 'Nuwara Eliya Town',          contactNumber: '0522227889', districtName: 'Nuwara Eliya' },
    { name: 'Galle Police Station',            code: 'PS_GAL_001', address: 'Galle Fort',                 contactNumber: '0912228990', districtName: 'Galle' },
    { name: 'Matara Police Station',           code: 'PS_MTA_001', address: 'Matara Town',                contactNumber: '0412229001', districtName: 'Matara' },
    { name: 'Hambantota Police Station',       code: 'PS_HAM_001', address: 'Hambantota Town',            contactNumber: '0472220112', districtName: 'Hambantota' },
    { name: 'Jaffna Police Station',           code: 'PS_JAF_001', address: 'Jaffna Town',                contactNumber: '0212221223', districtName: 'Jaffna' },
    { name: 'Kilinochchi Police Station',      code: 'PS_KIL_001', address: 'Kilinochchi Town',           contactNumber: '0212222334', districtName: 'Kilinochchi' },
    { name: 'Mannar Police Station',           code: 'PS_MAN_001', address: 'Mannar Town',                contactNumber: '0232223445', districtName: 'Mannar' },
    { name: 'Vavuniya Police Station',         code: 'PS_VAV_001', address: 'Vavuniya Town',              contactNumber: '0242224556', districtName: 'Vavuniya' },
    { name: 'Mullaitivu Police Station',       code: 'PS_MUL_001', address: 'Mullaitivu Town',            contactNumber: '0212225667', districtName: 'Mullaitivu' },
    { name: 'Batticaloa Police Station',       code: 'PS_BAT_001', address: 'Batticaloa Town',            contactNumber: '0652226778', districtName: 'Batticaloa' },
    { name: 'Ampara Police Station',           code: 'PS_AMP_001', address: 'Ampara Town',                contactNumber: '0632227889', districtName: 'Ampara' },
    { name: 'Trincomalee Police Station',      code: 'PS_TRI_001', address: 'Trincomalee Town',           contactNumber: '0262228990', districtName: 'Trincomalee' },
    { name: 'Kurunegala Police Station',       code: 'PS_KUR_001', address: 'Kurunegala Town',            contactNumber: '0372229001', districtName: 'Kurunegala' },
    { name: 'Puttalam Police Station',         code: 'PS_PUT_001', address: 'Puttalam Town',              contactNumber: '0322220112', districtName: 'Puttalam' },
    { name: 'Anuradhapura Police Station',     code: 'PS_ANU_001', address: 'Anuradhapura Town',          contactNumber: '0252221223', districtName: 'Anuradhapura' },
    { name: 'Polonnaruwa Police Station',      code: 'PS_POL_001', address: 'Polonnaruwa Town',           contactNumber: '0272222334', districtName: 'Polonnaruwa' },
    { name: 'Badulla Police Station',          code: 'PS_BAD_001', address: 'Badulla Town',               contactNumber: '0552223445', districtName: 'Badulla' },
    { name: 'Monaragala Police Station',       code: 'PS_MON_001', address: 'Monaragala Town',            contactNumber: '0552224556', districtName: 'Monaragala' },
    { name: 'Ratnapura Police Station',        code: 'PS_RAT_001', address: 'Ratnapura Town',             contactNumber: '0452225667', districtName: 'Ratnapura' },
    { name: 'Kegalle Police Station',          code: 'PS_KEG_001', address: 'Kegalle Town',               contactNumber: '0352226778', districtName: 'Kegalle' }
  ];

  const stationDocs = stationData.map(s => {
    const district = createdDistricts.find(d => d.name === s.districtName);
    const province = createdProvinces.find(p => p._id.equals(district.province));
    return {
      name: s.name,
      code: s.code,
      address: s.address,
      contactNumber: s.contactNumber,
      district: district._id,
      province: province._id
    };
  });
  await PoliceStation.insertMany(stationDocs);
  console.log('Police stations seeded');

  const regPrefixes = ['WP', 'CP', 'SP', 'EP', 'NP', 'NWP', 'NCP', 'UP', 'SGP'];
  const regLetters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';

  const driverDocs = [];
  for (let i = 0; i < 200; i++) {
    const district = getRandomItem(createdDistricts);
    driverDocs.push({
      name: getRandomName(),
      licenseNumber: `B${4000000 + i * 13}`,
      phone: `07${getRandomInt(10000000, 99999999)}`,
      nationalId: generateNIC(i),
      district: district._id
    });
  }
  const createdDrivers = await Driver.insertMany(driverDocs);
  console.log('Drivers seeded');

  const vehicleDocs = [];
  for (let i = 0; i < 200; i++) {
    const driver = createdDrivers[i];
    const district = getRandomItem(createdDistricts);
    const province = createdProvinces.find(p => p._id.equals(district.province));
    vehicleDocs.push({
      registrationNumber: `${regPrefixes[i % 9]}-${regLetters[Math.floor(i / 9) % regLetters.length]}-${String(1001 + Math.floor(i / (9 * regLetters.length))).padStart(4, '0')}`,
      driver: driver._id,
      district: district._id,
      province: province._id,
      color: getRandomItem(colors),
      year: getRandomInt(2010, 2023),
      deviceId: `GPS${String(100001 + i * 3)}`
    });
  }
  const createdVehicles = await Vehicle.insertMany(vehicleDocs);
  console.log('Vehicles seeded');

  console.log('Seeding location history, this may take a moment...');
  const now = new Date();
  const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const pingInterval = 15 * 60 * 1000;

  const locationDocs = [];
  for (const vehicle of createdVehicles) {
    let currentTime = new Date(oneWeekAgo);
    while (currentTime <= now) {
      locationDocs.push({
        vehicle: vehicle._id,
        latitude: getRandomFloat(5.9, 9.8),
        longitude: getRandomFloat(79.6, 81.9),
        speed: getRandomInt(0, 60),
        timestamp: new Date(currentTime)
      });
      currentTime = new Date(currentTime.getTime() + pingInterval);
    }
  }

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
