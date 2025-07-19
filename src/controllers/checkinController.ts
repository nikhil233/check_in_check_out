import { Request, Response } from 'express';
import Checkin from '../models/Checkin.js';
import Room from '../models/Room.js';
import User from '../models/User.js';
import Amenity from '../models/Amenity.js';
import { v4 as uuidv4 } from 'uuid';
import { validationResult } from 'express-validator';

export const checkIn = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { name, email, roomNumber } = req.body;
    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email });
    }
    // Find room
    const room = await Room.findOne({ number: roomNumber }).populate('amenities');
    if (!room) return res.status(404).json({ error: 'Room not found' });
    if (room.isOccupied) return res.status(400).json({ error: 'Room is already occupied' });
    // Assign room to user
    user.room = room._id as any;
    await user.save();
    room.isOccupied = true;
    await room.save();
    // Prepare amenities for checkin
    const amenities = room.amenities.map((amenity: any) => ({
      amenity: amenity._id,
      conditionAtCheckout: 'good', // default at check-in
    }));
    // Generate bookingId
    const bookingId = uuidv4();
    // Create checkin record
    const checkin = await Checkin.create({
      user: user._id,
      room: room._id,
      amenities,
      checkinDate: new Date(),
      bookingId,
    });
    res.status(201).json({ message: 'User checked in', checkin, bookingId });
  } catch (err) {
    res.status(500).json({ error: 'Check-in failed', details: err });
  }
};

export const checkOut = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { bookingId, amenities: amenitiesAtCheckout } = req.body;
    // Find checkin by bookingId
    const checkin = await Checkin.findOne({ bookingId, checkoutDate: { $exists: false } }).populate('room').populate('amenities.amenity');
    if (!checkin) return res.status(404).json({ error: 'Active check-in not found for this bookingId' });
    // Find user
    const user = await User.findById(checkin.user);
    if (!user) return res.status(404).json({ error: 'User not found' });
    // Update amenities condition at checkout
    let totalCharge = 0;
    for (const amenityStatus of amenitiesAtCheckout) {
      const checkinAmenity = checkin.amenities.find((a: any) => a.amenity._id.toString() === amenityStatus.amenityId);
      if (checkinAmenity) {
        checkinAmenity.conditionAtCheckout = amenityStatus.condition;
        // Calculate charge if not good
        if (amenityStatus.condition !== 'good') {
          const amenity = await Amenity.findById(amenityStatus.amenityId);
          if (amenity) totalCharge += amenity.charge;
        }
      }
    }
    checkin.checkoutDate = new Date();
    checkin.totalCharge = totalCharge;
    await checkin.save();
    // Free the room
    const room = await Room.findById(checkin.room._id);
    if (room) {
      room.isOccupied = false;
      await room.save();
    }
    // Remove room from user
    user.room = null;
    await user.save();
    res.status(200).json({ message: 'User checked out', totalCharge, checkin });
  } catch (err) {
    res.status(500).json({ error: 'Check-out failed', details: err });
  }
};

export const getBookingDetails = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { bookingId } = req.params;
    const checkin = await Checkin.findOne({ bookingId })
      .populate('user')
      .populate({
        path: 'room',
        populate: { path: 'amenities' }
      })
      .populate('amenities.amenity');
    if (!checkin) return res.status(404).json({ error: 'Booking not found' });
    res.status(200).json(checkin);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch booking details', details: err });
  }
};

export const getActiveBookings = async (req: Request, res: Response) => {
  try {
    const activeBookings = await Checkin.find({ checkoutDate: { $exists: false } })
      .populate('user')
      .populate({ path: 'room', populate: { path: 'amenities' } })
      .populate('amenities.amenity');
    res.status(200).json(activeBookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch active bookings', details: err });
  }
}; 