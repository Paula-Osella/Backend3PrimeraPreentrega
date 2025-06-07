import { Router } from 'express';
import {
  generateMockPetsController,
  generateMockUsersController,
  generateDataController
} from '../controllers/mocks.controller.js';

const router = Router();

router.get('/mockingpets', generateMockPetsController);
router.get('/mockingusers', generateMockUsersController);
router.post('/generateData', generateDataController);
export default router;
