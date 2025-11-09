import { Router } from 'express';
import { body } from 'express-validator';
import { login, register, refreshToken, getCurrentUser, logout } from './controller';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validator';

const router = Router();

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required'),
    validate,
  ],
  login
);

// POST /api/auth/register
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('roleId').notEmpty().withMessage('Role is required'),
    validate,
  ],
  register
);

// POST /api/auth/refresh
router.post('/refresh', refreshToken);

// GET /api/auth/me
router.get('/me', authenticate, getCurrentUser);

// POST /api/auth/logout
router.post('/logout', authenticate, logout);

export default router;
