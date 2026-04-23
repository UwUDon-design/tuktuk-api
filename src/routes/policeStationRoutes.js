import express from 'express';
import {
  getAllStations,
  getStationById,
  createStation,
  updateStation,
  deleteStation
} from '../controllers/policeStationController.js';
import { protect, adminOnly, policeOrAdmin } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { createStationRules, mongoIdParam } from '../middleware/validators.js';

const router = express.Router();

router.get('/', protect, policeOrAdmin, getAllStations);
router.get('/:id', protect, policeOrAdmin, mongoIdParam('id'), validate, getStationById);
router.post('/', protect, adminOnly, createStationRules, validate, createStation);
router.put('/:id', protect, adminOnly, mongoIdParam('id'), validate, updateStation);
router.delete('/:id', protect, adminOnly, mongoIdParam('id'), validate, deleteStation);

export default router;
