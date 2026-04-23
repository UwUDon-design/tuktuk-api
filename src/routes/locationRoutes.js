import express from 'express';
import { addLocation, getLastLocation, getLocationHistory, getAllActiveLocations } from '../controllers/locationController.js';
import { protect, policeOrAdmin } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { addLocationRules } from '../middleware/validators.js';

const router = express.Router();

router.post('/', protect, addLocationRules, validate, addLocation);
router.get('/active', protect, policeOrAdmin, getAllActiveLocations);
router.get('/:vehicleId/last', protect, policeOrAdmin, getLastLocation);
router.get('/:vehicleId/history', protect, policeOrAdmin, getLocationHistory);

export default router;
