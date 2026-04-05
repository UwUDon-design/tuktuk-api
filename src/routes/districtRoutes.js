import express from 'express';
import { getAllDistricts, getDistrictById, createDistrict } from '../controllers/districtController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getAllDistricts);
router.get('/:id', protect, getDistrictById);
router.post('/', protect, adminOnly, createDistrict);

export default router;