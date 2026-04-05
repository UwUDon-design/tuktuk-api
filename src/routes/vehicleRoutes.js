import express from 'express';
import { getAllVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle } from '../controllers/vehicleController.js';
import { protect, adminOnly, policeOrAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, policeOrAdmin, getAllVehicles);
router.get('/:id', protect, policeOrAdmin, getVehicleById);
router.post('/', protect, adminOnly, createVehicle);
router.put('/:id', protect, adminOnly, updateVehicle);
router.delete('/:id', protect, adminOnly, deleteVehicle);

export default router;