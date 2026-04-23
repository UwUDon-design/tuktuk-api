import express from 'express';
import { getAllProvinces, getProvinceById, createProvince, getDistrictsByProvince } from '../controllers/provinceController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { createProvinceRules, mongoIdParam } from '../middleware/validators.js';

const router = express.Router();

router.get('/', protect, getAllProvinces);
router.get('/:id', protect, mongoIdParam('id'), validate, getProvinceById);
router.get('/:id/districts', protect, mongoIdParam('id'), validate, getDistrictsByProvince);
router.post('/', protect, adminOnly, createProvinceRules, validate, createProvince);

export default router;
