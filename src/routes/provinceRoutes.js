import express from 'express';
import { getAllProvinces, getProvinceById, createProvince, getDistrictsByProvince } from '../controllers/provinceController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getAllProvinces);
router.get('/:id', protect, getProvinceById);
router.get('/:id/districts', protect, getDistrictsByProvince);
router.post('/', protect, adminOnly, createProvince);

export default router;