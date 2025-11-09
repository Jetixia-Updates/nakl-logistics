import { Router } from 'express';
import { authenticate } from '../../middleware/auth';

const router = Router();
router.use(authenticate);

router.get('/tracking/:vehicleId', (req, res) => res.json({ data: [] }));
router.post('/tracking', (req, res) => res.json({ message: 'Location updated' }));
router.get('/live/:workOrderId', (req, res) => res.json({ data: {} }));

export default router;
