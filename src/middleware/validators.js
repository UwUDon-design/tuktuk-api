import { body, param } from 'express-validator';

export const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['admin', 'police', 'operator']).withMessage('Role must be admin, police, or operator')
];

export const loginRules = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
];

export const createDriverRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('licenseNumber').trim().notEmpty().withMessage('License number is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required')
    .matches(/^[0-9]{10}$/).withMessage('Phone must be 10 digits'),
  body('nationalId').trim().notEmpty().withMessage('National ID is required'),
  body('district').isMongoId().withMessage('Valid district ID is required')
];

export const createVehicleRules = [
  body('registrationNumber').trim().notEmpty().withMessage('Registration number is required'),
  body('driver').isMongoId().withMessage('Valid driver ID is required'),
  body('district').isMongoId().withMessage('Valid district ID is required'),
  body('province').isMongoId().withMessage('Valid province ID is required'),
  body('color').trim().notEmpty().withMessage('Color is required'),
  body('year').isInt({ min: 1990, max: new Date().getFullYear() }).withMessage('Valid year is required'),
  body('deviceId').trim().notEmpty().withMessage('Device ID is required')
];

export const addLocationRules = [
  body('vehicleId').isMongoId().withMessage('Valid vehicle ID is required'),
  body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
  body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
  body('speed').optional().isFloat({ min: 0 }).withMessage('Speed must be a positive number')
];

export const createProvinceRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('code').trim().notEmpty().withMessage('Code is required')
];

export const createDistrictRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('code').trim().notEmpty().withMessage('Code is required'),
  body('province').isMongoId().withMessage('Valid province ID is required')
];

export const createStationRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('code').trim().notEmpty().withMessage('Code is required'),
  body('district').isMongoId().withMessage('Valid district ID is required'),
  body('province').isMongoId().withMessage('Valid province ID is required'),
  body('contactNumber').optional().matches(/^[0-9]{10}$/).withMessage('Contact number must be 10 digits')
];

export const mongoIdParam = (paramName) => [
  param(paramName).isMongoId().withMessage(`Invalid ${paramName}`)
];
