import { Router } from 'express';
import { getMarkets, getMarketByCrop } from '../controllers/marketController.js';

const router = Router();

router.get('/', getMarkets);
router.get('/:crop', getMarketByCrop);

export default router;
