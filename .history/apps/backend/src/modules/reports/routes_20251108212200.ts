import { Router } from 'express';
import { authenticate } from '../../middleware/auth';

const router = Router();
router.use(authenticate);

router.get('/financial', (req, res) => res.json({ data: {} }));
router.get('/operations', (req, res) => res.json({ data: {} }));
router.get('/dashboard', (req, res) => res.json({ data: {} }));

export default router;
