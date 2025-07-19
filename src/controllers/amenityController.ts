import { Request, Response } from 'express';
import Amenity from '../models/Amenity.js';
import { validationResult } from 'express-validator';

export const getAmenities = async (req: Request, res: Response) => {
  try {
    const amenities = await Amenity.find();
    res.status(200).json(amenities);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch amenities' });
  }
};

export const updateAmenityCondition = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { id } = req.params;
    const { condition } = req.body;
    const amenity = await Amenity.findByIdAndUpdate(id, { condition }, { new: true });
    if (!amenity) return res.status(404).json({ error: 'Amenity not found' });
    res.status(200).json(amenity);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update amenity condition' });
  }
}; 