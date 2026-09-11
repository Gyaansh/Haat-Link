import { Router } from 'express';
import { getOffers, createOffer } from '../controllers/offerController.js';

const router = Router();

router.get('/', getOffers);
router.post('/', createOffer);

export default router;
