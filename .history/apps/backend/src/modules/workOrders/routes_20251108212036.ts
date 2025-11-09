import { Router } from 'express';
import { authenticate } from '../../middleware/auth';

const router = Router();
router.use(authenticate);

router.get('/', (req, res) => res.json({ data: [] }));
router.post('/', (req, res) => res.json({ message: 'Work order created' }));
router.get('/:id', (req, res) => res.json({ data: {} }));
router.put('/:id', (req, res) => res.json({ message: 'Work order updated' }));
router.post('/:id/assign-vehicle', (req, res) => res.json({ message: 'Vehicle assigned' }));

export default router;
