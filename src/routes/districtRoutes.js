import express from 'express';
import { getAllDistricts, getDistrictById, createDistrict } from '../controllers/districtController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { createDistrictRules, mongoIdParam } from '../middleware/validators.js';

const router = express.Router();

router.get('/', protect, getAllDistricts);
router.get('/:id', protect, mongoIdParam('id'), validate, getDistrictById);
router.post('/', protect, adminOnly, createDistrictRules, validate, createDistrict);

export default router;
