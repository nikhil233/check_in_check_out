import mongoose, { Schema, Document } from 'mongoose';

export interface ICheckinAmenity {
  amenity: mongoose.Types.ObjectId;
  conditionAtCheckout: string;
}

export interface ICheckin extends Document {
  user: mongoose.Types.ObjectId;
  room: mongoose.Types.ObjectId;
  checkinDate: Date;
  checkoutDate?: Date;
  amenities: ICheckinAmenity[];
  totalCharge?: number;
  bookingId: string;
}

const CheckinAmenitySchema = new Schema<ICheckinAmenity>({
  amenity: { type: Schema.Types.ObjectId, ref: 'Amenity', required: true },
  conditionAtCheckout: { type: String, enum: ['good', 'damaged', 'missing'], required: true },
});

const CheckinSchema = new Schema<ICheckin>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  checkinDate: { type: Date, default: Date.now },
  checkoutDate: { type: Date },
  amenities: [CheckinAmenitySchema],
  totalCharge: { type: Number },
  bookingId: { type: String, required: true, unique: true },
});

CheckinSchema.index({ bookingId: 1 }, { unique: true });

export default mongoose.model<ICheckin>('Checkin', CheckinSchema); 