import express from 'express';
import { getAllDrivers, getDriverById, createDriver, updateDriver, deleteDriver } from '../controllers/driverController.js';
import { protect, adminOnly, policeOrAdmin } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { createDriverRules, mongoIdParam } from '../middleware/validators.js';

const router = express.Router();

router.get('/', protect, policeOrAdmin, getAllDrivers);
router.get('/:id', protect, policeOrAdmin, mongoIdParam('id'), validate, getDriverById);
router.post('/', protect, adminOnly, createDriverRules, validate, createDriver);
router.put('/:id', protect, adminOnly, mongoIdParam('id'), validate, updateDriver);
router.delete('/:id', protect, adminOnly, mongoIdParam('id'), validate, deleteDriver);

export default router;
