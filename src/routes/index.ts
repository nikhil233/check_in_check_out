import express from 'express';
import checkinRouter from './checkin.js';
import amenityRouter from './amenity.js';

const router = express.Router();

// Import and use sub-routers here (e.g., userRouter, roomRouter, etc.)
// router.use('/users', userRouter);
// router.use('/rooms', roomRouter);
router.use('/checkin', checkinRouter);
router.use('/amenity', amenityRouter);

export default router; 