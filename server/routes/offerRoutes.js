import { Router } from 'express';
import { getOffers, createOffer } from '../controllers/offerController.js';
import { optionalAuth } from '../req/auth.js';

const router = Router();

router.get('/', optionalAuth, getOffers);
router.post('/', optionalAuth, createOffer);

export default router;
