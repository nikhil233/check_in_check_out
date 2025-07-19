import express from 'express';
import { getAmenities, updateAmenityCondition } from '../controllers/amenityController.js';
import { body, param } from 'express-validator';

const router = express.Router();

router.get('/', getAmenities);
router.patch(
  '/:id',
  [
    param('id').isMongoId(),
    body('condition').isIn(['good', 'damaged', 'missing']),
  ],
  updateAmenityCondition
);

export default router; 