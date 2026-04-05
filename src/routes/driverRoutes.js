import express from 'express';
import { getAllDrivers, getDriverById, createDriver, updateDriver, deleteDriver } from '../controllers/driverController.js';
import { protect, adminOnly, policeOrAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, policeOrAdmin, getAllDrivers);
router.get('/:id', protect, policeOrAdmin, getDriverById);
router.post('/', protect, adminOnly, createDriver);
router.put('/:id', protect, adminOnly, updateDriver);
router.delete('/:id', protect, adminOnly, deleteDriver);

export default router;