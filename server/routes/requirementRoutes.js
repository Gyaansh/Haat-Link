import { Router } from 'express';
import { getRequirements, createRequirement } from '../controllers/requirementController.js';

const router = Router();

router.get('/', getRequirements);
router.post('/', createRequirement);

export default router;
