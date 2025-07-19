import mongoose, { Schema, Document } from 'mongoose';

export type AmenityCondition = 'good' | 'damaged' | 'missing';

export interface IAmenity extends Document {
  name: string;
  condition: AmenityCondition;
  charge: number;
}

const AmenitySchema = new Schema<IAmenity>({
  name: { type: String, required: true },
  condition: { type: String, enum: ['good', 'damaged', 'missing'], default: 'good' },
  charge: { type: Number, required: true },
});

AmenitySchema.index({ name: 1 }, { unique: true });

export default mongoose.model<IAmenity>('Amenity', AmenitySchema); 