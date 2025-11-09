import { Router } from 'express';
import { authenticate } from '../../middleware/auth';

const router = Router();
router.use(authenticate);

// Chart of Accounts routes
router.get('/', (req, res) => res.json({ data: [] }));
router.post('/', (req, res) => res.json({ message: 'Account created' }));
router.get('/:id', (req, res) => res.json({ data: {} }));
router.put('/:id', (req, res) => res.json({ message: 'Account updated' }));
router.delete('/:id', (req, res) => res.json({ message: 'Account deleted' }));

export default router;
