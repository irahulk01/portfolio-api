import express from 'express';
import { getVisitCount, incrementVisit, setVisitCount } from '../controllers/visitsController.js';

const router = express.Router();

router.get('/', getVisitCount);
router.post('/', incrementVisit);
router.patch('/', setVisitCount);

export default router;
