import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/users
router.get('/', authorize('users.read'), (req, res) => {
  res.json({ status: 'success', data: { users: [] } });
});

// POST /api/users
router.post('/', authorize('users.create'), (req, res) => {
  res.json({ status: 'success', message: 'User created' });
});

// GET /api/users/:id
router.get('/:id', authorize('users.read'), (req, res) => {
  res.json({ status: 'success', data: { user: {} } });
});

// PUT /api/users/:id
router.put('/:id', authorize('users.update'), (req, res) => {
  res.json({ status: 'success', message: 'User updated' });
});

// DELETE /api/users/:id
router.delete('/:id', authorize('users.delete'), (req, res) => {
  res.json({ status: 'success', message: 'User deleted' });
});

export default router;
