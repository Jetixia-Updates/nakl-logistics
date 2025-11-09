import { Router } from 'express';
import { authenticate } from '../../middleware/auth';

const router = Router();
router.use(authenticate);

router.get('/', (req, res) => res.json({ data: [] }));
router.post('/', (req, res) => res.json({ message: 'Vendor created' }));
router.get('/:id', (req, res) => res.json({ data: {} }));
router.put('/:id', (req, res) => res.json({ message: 'Vendor updated' }));

export default router;
