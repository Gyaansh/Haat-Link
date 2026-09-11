import { Router } from 'express';
import { getCrops, getCropTypes, createCrop, updateCrop, deleteCrop } from '../controllers/cropController.js';

const router = Router();

router.get('/', getCrops);
router.get('/types', getCropTypes);
router.post('/', createCrop);
router.put('/:id', updateCrop);
router.delete('/:id', deleteCrop);

export default router;
