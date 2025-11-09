import { Router } from 'express';
import { authenticate } from '../../middleware/auth';

const router = Router();
router.use(authenticate);

router.get('/', (req, res) => res.json({ data: [] }));
router.post('/', (req, res) => res.json({ message: 'Payment created' }));
router.get('/:id', (req, res) => res.json({ data: {} }));

export default router;
