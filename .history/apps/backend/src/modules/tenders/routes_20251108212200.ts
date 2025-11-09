import { Router } from 'express';
import { authenticate } from '../../middleware/auth';

const router = Router();
router.use(authenticate);

router.get('/', (req, res) => res.json({ data: [] }));
router.post('/', (req, res) => res.json({ message: 'Tender created' }));
router.get('/:id', (req, res) => res.json({ data: {} }));
router.put('/:id', (req, res) => res.json({ message: 'Tender updated' }));
router.post('/:id/submit-bid', (req, res) => res.json({ message: 'Bid submitted' }));

export default router;
