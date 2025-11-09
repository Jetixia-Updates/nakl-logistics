import { Router } from 'express';
import { authenticate } from '../../middleware/auth';

const router = Router();
router.use(authenticate);

router.get('/operations', (req, res) => res.json({ data: [] }));
router.post('/operations', (req, res) => res.json({ message: 'Operation created' }));
router.get('/inventory', (req, res) => res.json({ data: [] }));

export default router;
