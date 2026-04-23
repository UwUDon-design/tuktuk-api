import express from 'express';
import { getAllVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle } from '../controllers/vehicleController.js';
import { protect, adminOnly, policeOrAdmin } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { createVehicleRules, mongoIdParam } from '../middleware/validators.js';

const router = express.Router();

router.get('/', protect, policeOrAdmin, getAllVehicles);
router.get('/:id', protect, policeOrAdmin, mongoIdParam('id'), validate, getVehicleById);
router.post('/', protect, adminOnly, createVehicleRules, validate, createVehicle);
router.put('/:id', protect, adminOnly, mongoIdParam('id'), validate, updateVehicle);
router.delete('/:id', protect, adminOnly, mongoIdParam('id'), validate, deleteVehicle);

export default router;
