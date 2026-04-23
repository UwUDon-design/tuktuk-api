import express from 'express';
import { register, login } from '../controllers/authController.js';
import validate from '../middleware/validate.js';
import { registerRules, loginRules } from '../middleware/validators.js';

const router = express.Router();

router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);

export default router;
