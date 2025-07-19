import mongoose, { Schema, Document } from 'mongoose';

export interface IRoom extends Document {
  number: string;
  amenities: mongoose.Types.ObjectId[];
  isOccupied: boolean;
}

const RoomSchema = new Schema<IRoom>({
  number: { type: String, required: true, unique: true },
  amenities: [{ type: Schema.Types.ObjectId, ref: 'Amenity' }],
  isOccupied: { type: Boolean, default: false },
});

RoomSchema.index({ number: 1 }, { unique: true });

export default mongoose.model<IRoom>('Room', RoomSchema); 