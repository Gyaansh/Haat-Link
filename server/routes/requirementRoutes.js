import { Router } from 'express';
import { getRequirements, createRequirement } from '../controllers/requirementController.js';
import { optionalAuth } from '../req/auth.js';

const router = Router();

router.get('/', optionalAuth, getRequirements);
router.post('/', optionalAuth, createRequirement);

export default router;
