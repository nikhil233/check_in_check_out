import express from 'express';
import { checkIn, checkOut, getBookingDetails, getActiveBookings } from '../controllers/checkinController.js';
import { body, param } from 'express-validator';

const router = express.Router();

router.get('/bookings', getActiveBookings);

router.post(
  '/',
  [
    body('name').isString().notEmpty(),
    body('email').isEmail(),
    body('roomNumber').isString().notEmpty(),
  ],
  checkIn
);

router.post(
  '/checkout',
  [
    body('bookingId').isString().notEmpty(),
    body('amenities').isArray({ min: 1 }),
    body('amenities.*.amenityId').isString().notEmpty(),
    body('amenities.*.condition').isIn(['good', 'damaged', 'missing']),
  ],
  checkOut
);

router.get(
  '/:bookingId',
  [param('bookingId').isString().notEmpty()],
  getBookingDetails
);

export default router; 